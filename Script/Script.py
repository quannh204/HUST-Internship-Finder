import random
from datetime import datetime, timedelta
from pymongo import MongoClient

# 1. Kết nối MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['hust_internship_finder']
skills_collection = db['skills']
majors_collection = db['majors']
jobs_collection = db['jobs']

# 2. Tập dữ liệu giả lập Khối Kỹ Thuật (IT / Phần mềm)
companies = [
    "FPT Software", "Viettel", "VNG", "Noventiq", "Globaldev", 
    "CMC Global", "Sun Asterisk", "Rikkeisoft", "Tiki", "Momo"
]

job_titles = [
    "Thực tập sinh Full-stack (React/NestJS)", "Fresher Android Developer (Kotlin)", 
    "Thực tập sinh Cloud Engineering", "Kỹ sư Cầu nối BrSE", 
    "Thực tập sinh Frontend (Next.js)", "Fresher Data Entry", 
    "Backend Intern (NodeJS)", "Thực tập sinh QA/QC", 
    "Mobile App Intern", "Kỹ sư Hệ thống"
]

skills_list = [
    "React", "Next.js", "Nest.js", "Kotlin", 
    "Android", "Room Database", "Tiếng Nhật N3", 
    "Cloud Computing", "RESTful API", "Git", "Cấu trúc dữ liệu", 
    "SQL", "Làm việc nhóm", "Tư duy logic"
]

majors_list = [
    "Công nghệ thông tin", "Khoa học máy tính", "Kỹ thuật phần mềm", 
    "Hệ thống thông tin", "Điện tử viễn thông", "Kỹ thuật máy tính",
    "Mạng máy tính và truyền thông dữ liệu"
]

locations = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Linh hoạt"]

def get_or_create_doc(collection, name):
    doc = collection.find_one({"name": name})
    if doc: return doc['_id']
    return collection.insert_one({
        "name": name, 
        "createdAt": datetime.now(), 
        "updatedAt": datetime.now()
    }).inserted_id

def generate_mock_jobs(num_jobs=30):
    print(f"Đang tạo {num_jobs} jobs chuyên ngành kỹ thuật...")
    
    # Tạo sẵn ObjectId cho skills và majors
    skill_ids = {s: get_or_create_doc(skills_collection, s) for s in skills_list}
    major_ids = {m: get_or_create_doc(majors_collection, m) for m in majors_list}

    for i in range(num_jobs):
        job_skills = random.sample(list(skill_ids.values()), k=random.randint(2, 4))
        job_majors = random.sample(list(major_ids.values()), k=random.randint(1, 2))
        
        job_document = {
            "companyName": random.choice(companies),
            "title": random.choice(job_titles),
            "jobType": random.choice(["PART_TIME", "FULL_TIME"]),
            "description": "Tham gia phát triển các dự án thực tế của công ty. Yêu cầu nắm vững kiến thức nền tảng về lập trình.",
            "requirements": "Chủ động tìm hiểu công nghệ mới, có tinh thần trách nhiệm với task được giao.",
            "skills": job_skills,
            "majors": job_majors,
            "foreignLanguageAbility": random.choice(["TOEIC 550+", "Tiếng Anh đọc hiểu tài liệu", "JLPT N3", "Không yêu cầu"]),
            "location": random.choice(locations),
            "workType": random.choice(["OFFLINE", "REMOTE", "HYBRID"]),
            "experience": random.choice(["Chưa có kinh nghiệm", "Dưới 6 tháng", "Có project cá nhân/đồ án"]),
            "fresherAccepted": True,
            "salary": random.choice(["Thỏa thuận", "3 - 5 triệu", "Trợ cấp dự án", "Không lương"]),
            "deadline": datetime.now() + timedelta(days=random.randint(7, 45)),
            "sourceLink": "https://example.com/job-detail",
            "status": random.choice(["ACTIVE", "ACTIVE", "EXPIRED", "DRAFT"]),
            "tags": ["IT", "Thực tập", "Fresher", "Phần mềm"],
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }
        
        jobs_collection.insert_one(job_document)
        
    print("✅ Đã hoàn thành! 30 công việc mảng Kỹ thuật đã được thêm vào database.")

if __name__ == "__main__":
    generate_mock_jobs(30)