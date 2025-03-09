import os
import openai

# Configure your API key here or use environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

SUPPORTED_EXTENSIONS = ['.py', '.js', '.ts', '.java', '.cpp', '.c', '.cs']

def is_supported_file(filename):
    return any(filename.endswith(ext) for ext in SUPPORTED_EXTENSIONS)

def collect_code_files(root_dir):
    code_files = []
    for root, _, files in os.walk(root_dir):
        for file in files:
            if is_supported_file(file):
                code_files.append(os.path.join(root, file))
    return code_files

def read_file_content(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def analyze_code_with_openai(filename, content):
    prompt = f"""
You are a static code analysis tool like SonarQube.
Your task is to perform a detailed code scan on the following file:
Filename: {filename}

Provide the following:
1. Code Smells & Maintainability Issues
2. Security Vulnerabilities (focus on OWASP Top 10)
3. Refactoring Recommendations
4. Missing or Poor Documentation/Comments

Respond in a structured format using bullet points.

Code:
\"\"\"
{content}
\"\"\"
"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-1106-preview",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error analyzing {filename}: {e}"

def scan_project_with_openai(project_path):
    files = collect_code_files(project_path)
    results = {}

    for file_path in files:
        print(f"🔍 Scanning {file_path}...")
        content = read_file_content(file_path)
        analysis = analyze_code_with_openai(file_path, content)
        results[file_path] = analysis

    return results

def write_report(results, output_path="openai_code_scan_report.txt"):
    with open(output_path, "w", encoding="utf-8") as f:
        for filepath, analysis in results.items():
            f.write(f"\n{'='*40}\nAnalysis for: {filepath}\n{'='*40}\n")
            f.write(analysis + "\n")
    print(f"\n✅ Report saved to: {output_path}")

# Example usage
if __name__ == "__main__":
    project_path = input("Enter the path to your project directory: ").strip()
    if not os.path.exists(project_path):
        print("❌ Directory not found.")
    else:
        result = scan_project_with_openai(project_path)
        write_report(result)
