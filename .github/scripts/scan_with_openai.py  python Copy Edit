import os
import openai

openai.api_type = "azure"
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")
openai.api_version = "2023-05-15"

deployment_name = os.getenv("AZURE_DEPLOYMENT_NAME")

def scan_code(file_path):
    with open(file_path, 'r') as f:
        code = f.read()

    prompt = f"""Analyze the following code for security issues, bad practices, and suggest improvements:
```python
{code}
```"""

    try:
        response = openai.ChatCompletion.create(
            engine=deployment_name,
            messages=[
                {"role": "system", "content": "You are a secure code auditor."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2,
            max_tokens=1000
        )
        return response['choices'][0]['message']['content']
    except Exception as e:
        return f"Error scanning {file_path}: {str(e)}"

def scan_repo():
    report = ""
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith(('.py', '.js', '.java')):  # Add more extensions as needed
                path = os.path.join(root, file)
                print(f"Scanning {path}...")
                result = scan_code(path)
                report += f"\n## {path}\n{result}\n"

    with open("scan_report.md", "w") as f:
        f.write(report)

if __name__ == "__main__":
    scan_repo()
