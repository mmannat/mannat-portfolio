#include <vector>
#include <cstdlib>
#include <ctime>
#include <string>

#include <emscripten/emscripten.h>
#include <GLES3/gl3.h>
#include <GLFW/glfw3.h>

static int gWinW = 1000;
static int gWinH = 700;

struct Square {
  float x, y;   // center in NDC (-1..1)
  float size;
  float r, g, b;
};

static std::vector<Square> squares;
static bool dragging = false;
static int activeIndex = -1;
static float dragOffsetX = 0.0f;
static float dragOffsetY = 0.0f;

static GLFWwindow* gWindow = nullptr;

static GLuint program = 0;
static GLuint vao = 0, vbo = 0;
static GLint uOffset = -1;
static GLint uScale  = -1;
static GLint uColor  = -1;

static float rand01() { return (float)std::rand() / (float)RAND_MAX; }

static void addSquare() {
  Square s;
  s.x = rand01() * 1.6f - 0.8f;
  s.y = rand01() * 1.4f - 0.7f;
  s.size = 0.18f + rand01() * 0.15f;
  s.r = 0.2f + rand01() * 0.8f;
  s.g = 0.2f + rand01() * 0.8f;
  s.b = 0.2f + rand01() * 0.8f;
  squares.push_back(s);
}

static void removeTop() {
  if (!squares.empty()) squares.pop_back();
}

static GLuint compileShader(GLenum type, const char* src) {
  GLuint sh = glCreateShader(type);
  glShaderSource(sh, 1, &src, nullptr);
  glCompileShader(sh);

  GLint ok = 0;
  glGetShaderiv(sh, GL_COMPILE_STATUS, &ok);
  if (!ok) {
    GLint len = 0;
    glGetShaderiv(sh, GL_INFO_LOG_LENGTH, &len);
    std::string log(len, '\0');
    glGetShaderInfoLog(sh, len, &len, log.data());
    emscripten_log(EM_LOG_ERROR, "Shader compile error:\n%s", log.c_str());
  }
  return sh;
}

static GLuint createProgram(const char* vs, const char* fs) {
  GLuint v = compileShader(GL_VERTEX_SHADER, vs);
  GLuint f = compileShader(GL_FRAGMENT_SHADER, fs);

  GLuint p = glCreateProgram();
  glAttachShader(p, v);
  glAttachShader(p, f);
  glLinkProgram(p);

  GLint ok = 0;
  glGetProgramiv(p, GL_LINK_STATUS, &ok);
  if (!ok) {
    GLint len = 0;
    glGetProgramiv(p, GL_INFO_LOG_LENGTH, &len);
    std::string log(len, '\0');
    glGetProgramInfoLog(p, len, &len, log.data());
    emscripten_log(EM_LOG_ERROR, "Program link error:\n%s", log.c_str());
  }

  glDeleteShader(v);
  glDeleteShader(f);
  return p;
}

static void cursorToNDC(double cx, double cy, float& outX, float& outY) {
  outX = (float)((cx / (double)gWinW) * 2.0 - 1.0);
  outY = (float)(1.0 - (cy / (double)gWinH) * 2.0);
}

static bool hitTest(const Square& s, float mx, float my) {
  return (mx >= s.x - s.size &&
          mx <= s.x + s.size &&
          my >= s.y - s.size &&
          my <= s.y + s.size);
}

static void mouseButtonCallback(GLFWwindow* window, int button, int action, int) {
  if (button != GLFW_MOUSE_BUTTON_LEFT) return;

  double cx, cy;
  glfwGetCursorPos(window, &cx, &cy);

  float mx, my;
  cursorToNDC(cx, cy, mx, my);

  if (action == GLFW_PRESS) {
    for (int i = (int)squares.size() - 1; i >= 0; --i) {
      if (hitTest(squares[i], mx, my)) {
        Square picked = squares[i];
        squares.erase(squares.begin() + i);
        squares.push_back(picked);
        activeIndex = (int)squares.size() - 1;

        dragging = true;
        dragOffsetX = mx - squares[activeIndex].x;
        dragOffsetY = my - squares[activeIndex].y;
        break;
      }
    }
  } else if (action == GLFW_RELEASE) {
    dragging = false;
    activeIndex = -1;
  }
}

static void cursorPosCallback(GLFWwindow*, double cx, double cy) {
  if (!dragging || activeIndex < 0) return;

  float mx, my;
  cursorToNDC(cx, cy, mx, my);

  squares[activeIndex].x = mx - dragOffsetX;
  squares[activeIndex].y = my - dragOffsetY;
}

static void keyCallback(GLFWwindow*, int key, int, int action, int) {
  if (action != GLFW_PRESS) return;

  if (key == GLFW_KEY_A) addSquare();
  if (key == GLFW_KEY_DELETE || key == GLFW_KEY_BACKSPACE) removeTop();
}

static void frame() {
  int fbw, fbh;
  glfwGetFramebufferSize(gWindow, &fbw, &fbh);
  gWinW = fbw;
  gWinH = fbh;

  glViewport(0, 0, fbw, fbh);
  glClearColor(0.07f, 0.09f, 0.14f, 1.0f);
  glClear(GL_COLOR_BUFFER_BIT);

  glUseProgram(program);
  glBindVertexArray(vao);

  for (auto& s : squares) {
    glUniform2f(uOffset, s.x, s.y);
    glUniform1f(uScale, s.size);
    glUniform3f(uColor, s.r, s.g, s.b);
    glDrawArrays(GL_TRIANGLES, 0, 6);
  }

  glfwSwapBuffers(gWindow);
  glfwPollEvents();
}

int main() {
  std::srand((unsigned)time(nullptr));

  if (!glfwInit()) return 1;

  // IMPORTANT: Force OpenGL ES for WebGL
  glfwWindowHint(GLFW_CLIENT_API, GLFW_OPENGL_ES_API);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 0);

  gWindow = glfwCreateWindow(gWinW, gWinH, "Compositor Engine (Web)", nullptr, nullptr);
  if (!gWindow) return 1;

  glfwMakeContextCurrent(gWindow);
  glfwSwapInterval(1);

  glfwSetMouseButtonCallback(gWindow, mouseButtonCallback);
  glfwSetCursorPosCallback(gWindow, cursorPosCallback);
  glfwSetKeyCallback(gWindow, keyCallback);

  // Start with visible squares immediately
  for (int i = 0; i < 6; i++) addSquare();

  const char* vs = R"(
    #version 300 es
    precision mediump float;
    layout(location=0) in vec2 aPos;
    uniform vec2 uOffset;
    uniform float uScale;
    void main() {
      vec2 pos = aPos * uScale + uOffset;
      gl_Position = vec4(pos, 0.0, 1.0);
    }
  )";

  const char* fs = R"(
    #version 300 es
    precision mediump float;
    uniform vec3 uColor;
    out vec4 FragColor;
    void main() {
      FragColor = vec4(uColor, 1.0);
    }
  )";

  program = createProgram(vs, fs);
  glUseProgram(program);

  uOffset = glGetUniformLocation(program, "uOffset");
  uScale  = glGetUniformLocation(program, "uScale");
  uColor  = glGetUniformLocation(program, "uColor");

  emscripten_log(EM_LOG_CONSOLE, "Uniform locations: offset=%d scale=%d color=%d", uOffset, uScale, uColor);

  float vertices[] = {
    -1.0f, -1.0f,
     1.0f, -1.0f,
     1.0f,  1.0f,
    -1.0f, -1.0f,
     1.0f,  1.0f,
    -1.0f,  1.0f
  };

  glGenVertexArrays(1, &vao);
  glGenBuffers(1, &vbo);

  glBindVertexArray(vao);
  glBindBuffer(GL_ARRAY_BUFFER, vbo);
  glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

  glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 2 * sizeof(float), (void*)0);
  glEnableVertexAttribArray(0);

  glBindBuffer(GL_ARRAY_BUFFER, 0);
  glBindVertexArray(0);

  emscripten_set_main_loop(frame, 0, true);
  return 0;
}