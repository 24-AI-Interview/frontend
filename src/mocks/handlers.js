import { http, HttpResponse } from "msw";

const prepVideos = [
  { id: "F5sxMs0X-LI", title: "삼성전자 합격 - 1분 자기소개 (Shorts)", ratio: "16/9" },
  { id: "BRQVy9JBGwk", title: "토스 합격 - 1분 자기소개", ratio: "16/9" },
  { id: "SQh4wIHUwUY", title: "강지영 아나운서가 알려주는 면접 합격 팁", ratio: "16/9" },
  { id: "ktv-0e0KZ8M", title: "면접 답변 구조화 핵심 3단계", ratio: "16/9" },
];

let prepBookmarks = [];
let selfIntroItems = [
  {
    id: "si-1",
    title: "새 자기소개서",
    company: "샘플 기업",
    stage: "draft",
    updatedAt: new Date().toISOString(),
    body: "지원 동기와 경험을 간단히 정리한 예시 자기소개서입니다.",
  },
  {
    id: "si-2",
    title: "2025 상반기 지원서",
    company: "예시 테크",
    stage: "round1",
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    body: "프로젝트 경험과 직무 적합성을 강조했습니다.",
  },
];
let savedJobs = [
  {
    jobId: "job-1",
    title: "프론트엔드 개발자",
    company: "샘플 테크",
    deadline: "2025-02-28",
    savedAt: "2024-10-01",
    tags: ["React", "TypeScript"],
    url: "",
  },
  {
    jobId: "job-2",
    title: "웹 퍼블리셔",
    company: "예시 스튜디오",
    deadline: "2025-03-15",
    savedAt: "2024-10-05",
    tags: ["HTML", "CSS"],
    url: "",
  },
];
const interviewHistory = [
  {
    interviewId: "iv-1",
    date: "2024-10-10",
    questionCount: 6,
    usedResumeVersion: "2024-10-01",
    overallScore: 82.5,
    status: "completed",
  },
];

const sampleQuestions = [
  {
    id: "q-1",
    question: "지원한 직무에 적합하다고 생각하는 이유는 무엇인가요?",
    level: "기초",
    jobCategory: "공통",
    sampleAnswer: "지원 직무 경험과 프로젝트 사례를 중심으로 설명해 보세요.",
  },
  {
    id: "q-2",
    question: "팀 프로젝트에서 갈등을 해결했던 경험이 있나요?",
    level: "기초",
    jobCategory: "공통",
    sampleAnswer: "문제 원인, 합의 과정, 결과를 STAR로 정리해 보세요.",
  },
  {
    id: "q-3",
    question: "최근에 몰입해서 해결한 과제와 접근 방법을 말해 주세요.",
    level: "심화",
    jobCategory: "공통",
    sampleAnswer: "문제 정의, 해결 전략, 성과를 중심으로 답변하세요.",
  },
];

const interviewQuestions = [
  "자신의 강점과 약점을 각각 하나씩 말해 주세요.",
  "최근에 해결한 문제를 어떻게 접근했는지 설명해 주세요.",
  "팀 프로젝트에서 갈등이 발생했을 때 어떻게 대응했나요?",
  "지원 직무에서 가장 중요하다고 생각하는 역량은 무엇인가요?",
];

export const handlers = [
  http.get("/api/prep/videos", () => {
    return HttpResponse.json(prepVideos);
  }),

  http.get("/api/prep/questions", ({ request }) => {
    const url = new URL(request.url);
    const job = url.searchParams.get("job") || "";
    const level = url.searchParams.get("level") || "";
    const filtered = sampleQuestions.filter((q) => {
      if (level && q.level !== level) return false;
      if (!job) return true;
      return true;
    });
    return HttpResponse.json(filtered);
  }),

  http.get("/api/prep/bookmarks", () => {
    const data = prepBookmarks.map((b) => ({
      ...b,
      video: prepVideos.find((v) => v.id === b.videoId) || null,
    }));
    return HttpResponse.json(data);
  }),

  http.post("/api/prep/bookmark", async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    if (!body.videoId) {
      return HttpResponse.json({ message: "videoId required" }, { status: 400 });
    }
    const existing = prepBookmarks.find((b) => b.videoId === body.videoId);
    if (existing) return HttpResponse.json(existing);
    const next = {
      id: `bm-${Date.now()}`,
      videoId: body.videoId,
      createdAt: new Date().toISOString(),
    };
    prepBookmarks = [next, ...prepBookmarks];
    return HttpResponse.json(next, { status: 201 });
  }),

  http.delete("/api/prep/bookmark/:id", ({ params }) => {
    const { id } = params;
    prepBookmarks = prepBookmarks.filter((b) => b.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("/api/interview/questions", ({ request }) => {
    const url = new URL(request.url);
    const job = url.searchParams.get("job");
    const list = interviewQuestions.map((q, idx) => ({
      id: `live-q-${idx + 1}`,
      question: q,
      jobCategory: job || "공통",
    }));
    return HttpResponse.json(list);
  }),

  http.get("/api/selfintro", () => {
    return HttpResponse.json(selfIntroItems);
  }),

  http.get("/api/selfintro/:id", ({ params }) => {
    const item = selfIntroItems.find((i) => i.id === params.id);
    if (!item) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(item);
  }),

  http.post("/api/selfintro", async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    const next = {
      id: `si-${Date.now()}`,
      title: body.title || "새 자기소개서",
      company: body.company || "",
      stage: body.stage || "draft",
      updatedAt: new Date().toISOString(),
      body: body.body || "",
    };
    selfIntroItems = [next, ...selfIntroItems];
    return HttpResponse.json(next, { status: 201 });
  }),

  http.put("/api/selfintro/:id", async ({ params, request }) => {
    const body = await request.json().catch(() => ({}));
    const idx = selfIntroItems.findIndex((i) => i.id === params.id);
    if (idx < 0) return new HttpResponse(null, { status: 404 });
    const updated = {
      ...selfIntroItems[idx],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    selfIntroItems = [
      ...selfIntroItems.slice(0, idx),
      updated,
      ...selfIntroItems.slice(idx + 1),
    ];
    return HttpResponse.json(updated);
  }),

  http.delete("/api/selfintro/:id", ({ params }) => {
    selfIntroItems = selfIntroItems.filter((i) => i.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("/api/mypage/profile", ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    return HttpResponse.json({
      userId,
      education: { school: "샘플대", major: "컴퓨터공학", status: "재학", admissionYear: 2021 },
      certificates: [],
      experience: [],
      skills: ["React", "Figma"],
    });
  }),

  http.post("/api/mypage/profile", async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    return HttpResponse.json({ ...body });
  }),

  http.get("/api/mypage/selfintro", ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const data = selfIntroItems.map((item) => ({
      resumeId: item.id,
      title: item.title,
      length: item.body?.length || 0,
      createdAt: item.updatedAt,
      updatedAt: item.updatedAt,
      userId,
    }));
    return HttpResponse.json(data);
  }),

  http.get("/api/jobs/saved", ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    return HttpResponse.json(savedJobs.map((job) => ({ ...job, userId })));
  }),

  http.get("/api/interviews", ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    return HttpResponse.json(interviewHistory.map((item) => ({ ...item, userId })));
  }),
];
