def calculate_ats_score(resume_text, job_description):
    resume_words = set(resume_text.lower().split())
    jd_words = set(job_description.lower().split())
    matched_words = resume_words.intersection(jd_words)
    score = len(matched_words) / len(jd_words) * 100 if jd_words else 0
    return round(score, 2), list(matched_words)
