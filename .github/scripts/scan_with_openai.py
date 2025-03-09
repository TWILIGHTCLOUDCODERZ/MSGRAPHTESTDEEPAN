import os
import openai
import argparse

# --- Configuration from environment variables ---
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_BASE = os.getenv("OPENAI_API_BASE")
OPENAI_API_DEPLOYMENT_NAME = os.getenv("OPENAI_API_DEPLOYMENT_NAME")

if not all([OPENAI_API_KEY, OPENAI_API_BASE, OPENAI_API_DEPLOYMENT_NAME]):
    raise ValueError("Missing Azure OpenAI configuration in environment variables.")

openai.api_type = "azure"
openai.api_key = OPENAI_API_KEY
openai.api_base = OPENAI_API_BASE
openai.api_version = "2023-07-01-preview"

def scan_file(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        prompt = f"""
You are a code security scanner. Review the following code for any bugs, security vulnerabilities, performance issues, or anti-patterns. Provide a detailed report with suggestions:

File: {filepath}

Code:
{content}
"""
        response = openai.ChatCompletion.create(
            engine=OPENAI_API_DEPLOYMENT_NAME,
            messages=[
                {"role": "system", "content": "You are a helpful and expert code reviewer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=1000
        )

        return f"### Scan Report for {filepath} ###\n{response['choices'][0]['message']['content']}\n"
    except Exception as e:
        return f"Error scanning {filepath}: {e}\n"

def scan_directory(directory):
    results = ""
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith((".py", ".js", ".ts", ".java", ".cs", ".go", ".rb")):
                filepath = os.path.join(root, file)
                print(f"Scanning: {filepath}")
                results += scan_file(filepath) + "\n\n"
    return results

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("directory", help="Path to the codebase to scan")
    parser.add_argument("--output", help="Path to save the scan report", default="openai_code_scan_report.txt")
    args = parser.parse_args()

    report = scan_directory(args.directory)

    with open(args.output, "w", encoding="utf-8") as f:
        f.write(report)

    print(f"\n✅ Scan complete. Report saved to {args.output}")

if __name__ == "__main__":
    main()
