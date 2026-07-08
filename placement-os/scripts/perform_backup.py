import os
import shutil
import datetime

def backup():
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    base_dir = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\src\data\aptitude"
    backup_dir = os.path.join(base_dir, f"backup_{timestamp}")
    
    print(f"Creating backup directory: {backup_dir}")
    os.makedirs(backup_dir, exist_ok=True)
    
    categories = ["quantitative", "logical", "verbal", "data-interpretation", "puzzles"]
    for cat in categories:
        src_path = os.path.join(base_dir, cat, "questions.json")
        if os.path.exists(src_path):
            dest_path = os.path.join(backup_dir, f"{cat}_questions.json")
            shutil.copy2(src_path, dest_path)
            print(f"  Backed up {cat}/questions.json -> {dest_path}")
            
        # Back up raw/quarantine/review if they exist
        for f_name in ["questions_raw.json", "quarantine.json", "review.json"]:
            src_f = os.path.join(base_dir, cat, f_name)
            if os.path.exists(src_f):
                dest_f = os.path.join(backup_dir, f"{cat}_{f_name}")
                shutil.copy2(src_f, dest_f)
                print(f"  Backed up {cat}/{f_name} -> {dest_f}")
                
    report_src = r"C:\Users\AASHISH\OneDrive\Desktop\placement-os\placement-os\aptitude-audit-report.json"
    if os.path.exists(report_src):
        report_dest = os.path.join(backup_dir, "aptitude-audit-report.json")
        shutil.copy2(report_src, report_dest)
        print(f"  Backed up aptitude-audit-report.json -> {report_dest}")
        
    print("Backup completed successfully.")

if __name__ == "__main__":
    backup()
