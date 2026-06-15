# 🧮 Math Support Test

Test your LaTeX math support with these examples:

## Inline Math

The Pythagorean theorem: $a^2 + b^2 = c^2$

Euler's identity: $e^{i\pi} + 1 = 0$

Quadratic formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

Square root: $\sqrt{x^2 + y^2}$

Fractions: $\frac{1}{2} + \frac{3}{4} = \frac{5}{4}$

Limits: $\lim_{x \to \infty} \frac{1}{x} = 0$

Derivatives: $\frac{d}{dx}(x^2) = 2x$

Integrals: $\int_0^1 x^2 dx = \frac{1}{3}$

Summation: $\sum_{n=1}^{\infty} \frac{1}{n^2}$

## Block Math

### Basic Equations

The quadratic formula:
$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

### Calculus

Derivative definition:
$$
f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}
$$

Integration by parts:
$$
\int u \, dv = uv - \int v \, du
$$

### Linear Algebra

Matrix multiplication:
$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}
$$

Eigenvalue equation:
$$
A\mathbf{v} = \lambda\mathbf{v}
$$

### Statistics

Normal distribution:
$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}
$$

Binomial coefficient:
$$
\binom{n}{k} = \frac{n!}{k!(n-k)!}
$$

### Physics

Newton's second law:
$$
\mathbf{F} = m\mathbf{a}
$$

Kinetic energy:
$$
E_k = \frac{1}{2}mv^2
$$

Einstein's mass-energy equivalence:
$$
E = mc^2
$$

### Complex Analysis

Cauchy-Riemann equations:
$$
\frac{\partial u}{\partial x} = \frac{\partial v}{\partial y}, \quad
\frac{\partial u}{\partial y} = -\frac{\partial v}{\partial x}
$$

### Number Theory

Euler's product formula:
$$
\zeta(s) = \prod_{p \text{ prime}} \frac{1}{1-p^{-s}}
$$

### Geometry

Circle equation:
$$
x^2 + y^2 = r^2
$$

Ellipse equation:
$$
\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1
$$

### Advanced Examples

Multiline equations:
$$
\begin{aligned}
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{H} &= \frac{\partial \mathbf{D}}{\partial t} + \mathbf{J} \\
\nabla \cdot \mathbf{D} &= \rho \\
\nabla \cdot \mathbf{B} &= 0
\end{aligned}
$$

Taylor series:
$$
f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n
$$

Fourier transform:
$$
\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x)e^{-2\pi i x\xi}dx
$$

## Test in Context

Math formulas work with emojis: :rocket: $E = mc^2$ :star:

**Bold text** with math: $x^2 + y^2 = z^2$

*Italic text* with math: $\pi = 3.14159...$

Lists with math:
- First equation: $a^2 + b^2 = c^2$
- Second equation: $E = mc^2$
- Third equation: $\pi = 3.14159...$

## Special Characters & Symbols

Greek letters: $\alpha, \beta, \gamma, \delta, \epsilon, \pi, \omega$

Operators: $\times, \div, \pm, \mp, \cdot, \circ$

Relations: $\leq, \geq, \neq, \approx, \equiv, \subset, \supset$

Arrows: $\rightarrow, \leftarrow, \leftrightarrow, \Rightarrow, \Leftarrow, \Leftrightarrow$

## Complex Formulas

Black-Scholes equation:
$$
\frac{\partial V}{\partial t} + \frac{1}{2}\sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} + rS \frac{\partial V}{\partial S} - rV = 0
$$

Schrödinger equation:
$$
i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \left[ -\frac{\hbar^2}{2m}\nabla^2 + V(\mathbf{r},t) \right] \Psi(\mathbf{r},t)
$$

Heat equation:
$$
\frac{\partial u}{\partial t} = \alpha \nabla^2 u
$$

Wave equation:
$$
\frac{\partial^2 u}{\partial t^2} = c^2 \nabla^2 u
$$

---

*Reload your extension and test this file to see LaTeX math in action!*