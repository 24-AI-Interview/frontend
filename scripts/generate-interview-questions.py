#!/usr/bin/env python3
import csv
import json
import os
import sys
from pathlib import Path


def read_env_int(name, default):
    value = os.environ.get(name)
    if value is None or value == "":
        return default
    try:
        return int(value)
    except ValueError:
        return default


def main():
    default_input = "/Users/joyein/Downloads/interview_question_grouped_by_major.csv"
    input_path = Path(
        os.environ.get("INTERVIEW_QUESTIONS_CSV")
        or (sys.argv[1] if len(sys.argv) > 1 else default_input)
    )
    output_path = Path(
        os.environ.get("OUTPUT_JS") or "src/data/interviewQuestionsByJob.js"
    )
    default_limit = read_env_int("QUESTION_LIMIT", 30)

    if not input_path.exists():
        raise SystemExit(f"Input CSV not found: {input_path}")

    job_questions = {}

    with input_path.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            major = (row.get("대분류") or "").strip()
            role = (row.get("직군_역할") or "").strip()
            question = (row.get("질문") or "").strip()
            if not major or not role or not question:
                continue
            key = f"{major}/{role}"
            job_questions.setdefault(key, [])
            if question not in job_questions[key]:
                job_questions[key].append(question)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8", newline="\n") as f:
        f.write("// Auto-generated from interview_question_grouped_by_major.csv\n")
        f.write("// Do not edit by hand. Update the CSV and re-generate.\n")
        f.write(f"export const DEFAULT_QUESTION_LIMIT = {default_limit};\n")
        f.write("export const interviewQuestionsByJob = ")
        f.write(json.dumps(job_questions, ensure_ascii=False, indent=2))
        f.write(";\n")
        f.write("export const getQuestionsForJob = (job, limit = DEFAULT_QUESTION_LIMIT) => {\n")
        f.write("  if (!job) return [];\n")
        f.write("  const list = interviewQuestionsByJob[job];\n")
        f.write("  if (!Array.isArray(list) || list.length === 0) return [];\n")
        f.write("  return typeof limit === \"number\" ? list.slice(0, Math.max(0, limit)) : list;\n")
        f.write("};\n")

    print(f"wrote {output_path}")
    print(f"jobs {len(job_questions)}")


if __name__ == "__main__":
    main()
