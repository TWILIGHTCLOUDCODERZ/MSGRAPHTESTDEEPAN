import os
import openai
from openai import AzureOpenAI

SENSITIVE_FILES = [".env", ".env.local", ".env.production"]

def delete_sensitive_files():
    for file in SENSITIVE_FILES:
        if os.path.exists(file):
            try:
                os.remove(file)
                print(f"🔒 Deleted sensitive file: {file}")
            except Exception as e:
                print(f"⚠️ Failed to delete {file}: {e}")

def scan_repo():
    delete_sensitive_files()
    
    client = AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_API_KEY"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_version="2023-05-15"
    )

    report_lines = []
    for root, _, files in os.walk("."):
        for file in files:
            file_path = os.path.join(root, file)
            if not file_path.endswith((".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".json")):
                continue

            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    code = f.read()

                response = client.chat.completions.create(
                    model=os.getenv("AZURE_DEPLOYMENT_NAME"),
                    messages=[
                        {"role": "system", "content": "You are a secure code auditor."},
                        {"role": "user", "content": f"Scan the following code:\n{code}"}
                    ],
                    temperature=0.1,
                    max_tokens=1000
                )

                result = response.choices[0].message.content.strip()
                report_lines.append(f"## {file_path}\n{result}\n")

            except Exception as e:
                report_lines.append(f"## {file_path}\nError scanning {file_path}: {e}\n")

    with open("scan_report.md", "w", encoding="utf-8") as report_file:
        report_file.write("\n".join(report_lines))
    print("✅ AI Code Scan complete. Report saved to scan_report.md")

if __name__ == "__main__":
    scan_repo()
