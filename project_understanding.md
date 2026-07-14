# AdvRecruiter — Full Project Understanding

## 🎯 What We're Building

A Python-based AI system that reads **100,000 candidate profiles** and ranks the **top 100 best fits** for a specific job description, outputting a CSV in a very strict format.

---

## 📋 The Job Description (What We're Ranking For)

**Role:** Senior AI Engineer — Founding Team at Redrob AI (Series A startup)  
**Location:** Pune / Noida, India (Hybrid) — candidates from Hyderabad, Mumbai, Delhi NCR also welcome  
**Experience:** 5–9 years (but it's a range, not a hard rule)

### ✅ Must-Have Skills
| Skill | Notes |
|---|---|
| Embeddings-based retrieval (sentence-transformers, BGE, E5, OpenAI embeddings) | Must be **production deployed**, not just tutorials |
| Vector databases (Pinecone, Weaviate, Qdrant, Milvus, FAISS, Elasticsearch) | Operational experience matters |
| Strong Python | Code quality matters |
| Evaluation frameworks (NDCG, MRR, MAP, A/B testing for ranking systems) | If they haven't thought about this, they won't fit |

### 🟡 Nice-to-Have Skills
- LLM fine-tuning (LoRA, QLoRA, PEFT)
- Learning-to-rank (XGBoost, neural LTR)
- HR-tech / marketplace experience
- Open-source AI/ML contributions

### ❌ Explicit Disqualifiers
- Pure research background, no production deployment
- "AI experience" = only LangChain wrapper calls (< 12 months)
- Senior engineers who haven't written code in 18+ months
- Career only at consulting firms (TCS, Infosys, Wipro, Accenture, etc.)
- Only CV/Speech/Robotics — no NLP/IR exposure
- Only keyword-matching skills, not real system-level thinking

### 🏆 Ideal Candidate Profile
- 6–8 years total, 4–5 in applied ML at **product companies** (not services)
- Shipped at least one end-to-end ranking/search/recommendation system to real users
- Located in or willing to relocate to Noida or Pune
- Active on Redrob platform (engaged, responding to recruiters)

---

## 📁 Data We Have

### The Candidate Pool
- **100,000 candidates** in `candidates.jsonl` (the full file, ~465 MB uncompressed)
- **50 sample candidates** in `sample_candidates.json` (for quick testing)

### Each Candidate Has 6 Main Sections:

| Section | Key Fields |
|---|---|
| `profile` | name, headline, summary, location, country, years_of_experience, current_title, current_company, company_size, industry |
| `career_history` | list of jobs (company, title, dates, duration_months, industry, company_size, description) |
| `education` | institution, degree, field_of_study, years, **tier** (tier_1 to tier_4) |
| `skills` | name, proficiency (beginner/intermediate/advanced/expert), endorsements, duration_months |
| `certifications` | name, issuer, year |
| `redrob_signals` | 23 behavioral signals (see below) |

### The 23 Behavioral Signals
| # | Signal | What It Tells Us |
|---|---|---|
| 1 | `profile_completeness_score` (0-100) | How complete their profile is |
| 2 | `signup_date` | When they joined |
| 3 | `last_active_date` | **CRITICAL** — When they last logged in |
| 4 | `open_to_work_flag` | Are they actively looking? |
| 5 | `profile_views_received_30d` | How often recruiters are viewing them |
| 6 | `applications_submitted_30d` | Actively applying = motivated |
| 7 | `recruiter_response_rate` (0.0–1.0) | **CRITICAL** — Do they actually respond? |
| 8 | `avg_response_time_hours` | How fast they respond |
| 9 | `skill_assessment_scores` | Platform-verified skill scores |
| 10 | `connection_count` | Network size |
| 11 | `endorsements_received` | Social proof |
| 12 | `notice_period_days` (0–180) | JD prefers sub-30 days |
| 13 | `expected_salary_range_inr_lpa` | Salary fit |
| 14 | `preferred_work_mode` | remote/hybrid/onsite/flexible |
| 15 | `willing_to_relocate` | Important since JD prefers Pune/Noida |
| 16 | `github_activity_score` (-1 to 100) | -1 means no GitHub linked |
| 17 | `search_appearance_30d` | Platform search visibility |
| 18 | `saved_by_recruiters_30d` | Other recruiters are interested = good signal |
| 19 | `interview_completion_rate` (0.0–1.0) | Do they show up to interviews? |
| 20 | `offer_acceptance_rate` (-1 to 1.0) | -1 = no offer history |
| 21 | `verified_email` | Trust signal |
| 22 | `verified_phone` | Trust signal |
| 23 | `linkedin_connected` | Professional presence |

---

## 📤 Output Format (Strict Rules)

**File:** `team_xxx.csv`  
**Encoding:** UTF-8  
**Columns (in this exact order):** `candidate_id, rank, score, reasoning`

```
candidate_id,rank,score,reasoning
CAND_0042871,1,0.987,"Senior AI Engineer with 7 years building RAG systems at product companies; strong recent engagement and Bangalore-based."
CAND_0019884,2,0.973,"6 years applied ML; previously shipped vector search at scale; matches the 'product over research' profile in the JD."
...
CAND_0007729,100,0.412,"Adjacent skills only — likely below cutoff but included as final filler."
```

### Hard Rules:
- Exactly **100 rows** (not 99, not 101)
- Ranks **1 to 100** each appearing exactly once
- Each `candidate_id` appears exactly once and must exist in `candidates.jsonl`
- `score` must be **non-increasing** (rank 1 has highest score, rank 100 has lowest)
- `reasoning` is optional but **heavily recommended** — affects Stage 4 manual review

---

## ⚠️ TRAPS We Must Avoid

### 1. Honeypots (~80 candidates)
- Candidates with **impossible profiles** (e.g., 8 years at a company founded 3 years ago)
- If > 10% of our top 100 are honeypots → **instant disqualification**
- Our system should catch these naturally by cross-checking dates

### 2. Keyword Stuffers
- Candidates who have all the right AI keywords in their skills list but wrong job titles (e.g., "Marketing Manager" with "Pinecone" in skills)
- A keyword-only system would rank these high — we must not
- **Solution:** Weight career history and job titles heavily, not just skills list

### 3. Perfect-Paper-But-Inactive Candidates
- Someone who looks amazing on paper but hasn't logged in for 6 months and has a 5% recruiter response rate
- **Solution:** Use behavioral signals as a multiplier/penalty

---

## 🏁 Evaluation Metrics (How We're Scored)

```
Final Score = 0.50 × NDCG@10 + 0.30 × NDCG@50 + 0.15 × MAP + 0.05 × P@10
```

**NDCG@10 is most important (50% weight)** — our top 10 picks matter the most!

---

## ⚙️ Compute Constraints (Hard Limits)

| Constraint | Limit |
|---|---|
| Total runtime (ranking step) | ≤ 5 minutes |
| Memory | ≤ 16 GB RAM |
| Compute | CPU only — no GPU |
| Network | OFF — no API calls to OpenAI/Claude/etc. |
| Disk | ≤ 5 GB |

> **Pre-computation is allowed!** Generating embeddings can happen before the 5-min window. Only the final ranking step must complete in 5 min.

---

## ❓ Open Questions for the User

1. **Candidate file format:** The README says `candidates.jsonl.gz` (gzipped), but the folder has `candidates.jsonl` directly (487 MB). Is this already unzipped, or is there also a `.gz` version?
2. **Team name:** What's our registered team/participant ID? This determines the output filename (e.g., `team_xxx.csv`).
3. **Sandbox requirement:** We need a hosted sandbox (HuggingFace Spaces, Streamlit Cloud, etc.). Do you have a preference or existing account on any of these platforms?
4. **Scoring weights priority:** Since NDCG@10 is 50% of our score, should we focus heavily on getting the top 10 absolutely perfect vs. worrying about all 100?
