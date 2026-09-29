import os

for root, dirs, files in os.walk("apps"):
    for file in files:
        if file.endswith(".py"):
            with open(os.path.join(root, file), "r", encoding="utf-8") as f:
                content = f.read()
                if "ForeignKey('Currency'" in content or "ForeignKey(\"Currency\"" in content:
                    print(f"Found string FK in {os.path.join(root, file)}")
