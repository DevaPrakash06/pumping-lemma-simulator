# Formal Language & Automata – Pumping Lemma Simulator

An interactive, academic dashboard and presentation platform for **Formal Languages and Automata Theory**, built with **React**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Key Capabilities

### 1. Problem 1: CFL Pumping Lemma for $L = \{ a^n b^n a^n \mid n \ge 1 \}$
- **10-Step Guided Flow**: Proof by contradiction following standard university curricula (Hopcroft & Ullman, Sipser).
- **Three-Block Visualizer**: Displays $s = a^p b^p a^p$ divided into three distinct visual blocks ($a^p$, $b^p$, $a^p$).
- **Geometric Window Theorem**: Graphically demonstrates why $|vwx| \le p$ prevents $vwx$ from ever touching both Block 1 and Block 3 across the $p$-symbol separation buffer of Block 2.
- **Interactive Decomposition Explorer**: Color-coded segments ($u$ cyan, $v$ emerald, $w$ amber, $x$ rose, $y$ purple) with live constraint verification for $|vwx| \le p$ and $|vx| > 0$.
- **Animated Pumping**: Visualizes pumping down ($i = 0$) and pumping up ($i = 2$) with real-time membership validation and symbol counting.
- **Exhaustive 5-Case Explorer**: Proves that *every* possible valid decomposition fails, avoiding the fallacy of relying on a single chosen split.
- **Quantifier Game**: Game-theoretic formulation of the Pumping Lemma ($\forall$ vs $\exists$, Opponent vs Prover).
- **Classroom Presentation Mode**: Fullscreen slide carousel with speaker notes and verbatim LaTeX proof export.

### 2. Problem 2: Add Your Sum (Extensible Dynamic Simulator)
- **Question Input**: Enter any formal language or problem statement.
- **Handwritten Notes**: Paste transcribed handwritten derivations.
- **Photograph Upload**: Drag-and-drop or select a photo of your handwritten paper with inspection zoom.
- **Intelligent Parser & Solver**: Automatically detects whether the problem requires the **Regular Pumping Lemma** ($s = xyz$) or the **Context-Free Pumping Lemma** ($s = uvwxy$).
- **Pre-Built Presets**: Includes instant one-click sums:
  - $L = \{ 0^n 1^n \mid n \ge 0 \}$ (Regular Pumping Lemma)
  - $L = \{ a^n b^n c^n \mid n \ge 1 \}$ (CFL Pumping Lemma)
  - $L = \{ ww \mid w \in \{0, 1\}^* \}$ (Copy Language)
  - $L = \{ w w^R \mid w \in \{a, b\}^* \}$ (Palindromes)
- **No Fabrication Safeguard**: Requires essential language definitions and goals before running. Prompts for clarification if handwriting is illegible or essential equations are missing.

---

## 🚀 Quick Setup & Run Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm

### Run Locally

1. Open PowerShell / Terminal in the project directory:
   ```powershell
   cd "C:\Users\Deva Prakash S.M\.gemini\antigravity-ide\scratch\pumping-lemma-simulator"
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```
   http://localhost:5173/
   ```

5. Production Build:
   ```bash
   npm run build
   ```

6. Run the 36-Test Automated Verification Suite:
   ```bash
   npx tsx test-automata.ts
   ```

---

## 📐 Mathematical Proof Structure for $L = \{ a^n b^n a^n \mid n \ge 1 \}$

1. **Assumption:** Suppose $L$ is a Context-Free Language.
2. **Pumping Length:** By the CFL Pumping Lemma, there exists a constant $p \ge 1$.
3. **Choice of String:** Choose $s = a^p b^p a^p \in L$, where $|s| = 3p \ge p$.
4. **Decomposition:** $s = uvwxy$ such that $|vwx| \le p$, $|vx| > 0$, and $\forall i \ge 0, uv^i wx^i y \in L$.
5. **Separation Rule:** Because $|vwx| \le p$ and the middle block of $b$'s has length $p$, $vwx$ can span at most two adjacent blocks and can **never** span both the first $a^p$ and the second $a^p$.
6. **Casework:**
   - **Case 1 ($vwx \subseteq a^p$ 1st block):** Pumping alters only first $a$'s ($N_a^{(1)} \ne N_a^{(2)}$).
   - **Case 2 ($vwx$ spans 1st $a^p$ and $b^p$):** 3rd block stays with $p$ $a$'s; pumping alters 1st $a$'s or $b$'s, or produces out-of-order symbols ($N_a^{(1)} \ne N_a^{(2)}$).
   - **Case 3 ($vwx \subseteq b^p$ middle block):** Pumping alters only $b$'s ($N_b \ne N_a$).
   - **Case 4 ($vwx$ spans $b^p$ and 2nd $a^p$):** 1st block stays with $p$ $a$'s; pumping alters $b$'s or 2nd $a$'s ($N_a^{(1)} \ne N_a^{(2)}$).
   - **Case 5 ($vwx \subseteq a^p$ 2nd block):** Pumping alters only 2nd $a$'s ($N_a^{(1)} \ne N_a^{(2)}$).
7. **Contradiction:** Every valid decomposition fails for $i = 0$ or $i = 2$.
8. **Conclusion:** $L = \{ a^n b^n a^n \mid n \ge 1 \}$ is **not context-free**. $\blacksquare$
