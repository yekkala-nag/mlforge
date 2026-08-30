import { BaseAgent } from "./base-agent";

export class CodeMentorAgent extends BaseAgent {
  constructor() {
    super(
      "code-mentor",
      "Code Mentor Agent",
      "Reviews code, suggests improvements, and teaches coding best practices",
      ["review-code", "suggest-improvement", "debug"]
    );

    this.on("review", async (msg) => {
      const { code, language } = msg.payload as {
        code: string;
        language: string;
      };

      const issues = this.findIssues(code, language);
      const suggestions = this.generateSuggestions(language);

      return this.createResponse(msg, "response", {
        score: Math.max(0, 100 - issues.length * 15),
        issues,
        suggestions,
        praise: this.findPraise(code),
      });
    });

    this.on("debug", async (msg) => {
      const { error } = msg.payload as { error: string };
      const diagnosis = this.diagnoseError(error);

      return this.createResponse(msg, "response", {
        diagnosis,
        fix: this.suggestFix(error),
        explanation: `The error "${error}" typically occurs when...`,
      });
    });

    this.on("refactor", async (msg) => {
      return this.createResponse(msg, "response", {
        suggestions: [
          "Consider using more descriptive variable names",
          "Extract repeated logic into functions",
          "Add type hints for better code clarity",
        ],
      });
    });

    this.on("*", async (msg) => {
      return this.createResponse(msg, "response", {
        message: `Code Mentor received: ${msg.topic}`,
      });
    });
  }

  private findIssues(code: string, language: string): string[] {
    const issues: string[] = [];
    if (code.includes("print(") && language === "python") {
      issues.push("Consider using logging instead of print for production code");
    }
    if (code.includes("except:") || code.includes("except Exception:")) {
      issues.push("Bare except clauses catch too many exceptions");
    }
    if (code.length > 500) {
      issues.push("Function is quite long. Consider breaking it into smaller functions");
    }
    return issues;
  }

  private generateSuggestions(language: string): string[] {
    const suggestions: string[] = [];
    if (language === "python") {
      suggestions.push("Add docstrings to explain function purpose");
      suggestions.push("Use type hints for better IDE support");
    }
    return suggestions;
  }

  private findPraise(code: string): string[] {
    const praise: string[] = [];
    if (code.includes("# ")) praise.push("Good use of comments");
    if (code.includes("def ") && code.includes(":")) {
      praise.push("Well-structured functions");
    }
    return praise;
  }

  private diagnoseError(error: string): string {
    if (error.includes("IndexError")) return "Array index out of bounds";
    if (error.includes("ValueError")) return "Invalid value passed to function";
    if (error.includes("KeyError")) return "Dictionary key not found";
    return "Check variable types and values";
  }

  private suggestFix(error: string): string {
    if (error.includes("IndexError")) return "Add bounds checking before indexing";
    if (error.includes("ValueError")) return "Validate input before passing to function";
    return "Review the code around the error location";
  }
}
