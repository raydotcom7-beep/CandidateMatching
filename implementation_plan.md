# Schema-Agnostic JSON Candidate Ranking

This plan introduces a dynamic, schema-agnostic fallback mode (Option 3). It detects whether candidates are formatted in the standard schema or an arbitrary one. For arbitrary schemas, it recursively flattens the entire JSON object into a single semantic text string to compute semantic similarity embeddings, while disabling feature scores that rely on specific keys.

## User Review Required

> [!IMPORTANT]
> **Scoring Fallback Logic:** Since arbitrary JSON schemas lack structured keys for location, notice period, and career history details, all non-semantic features (e.g. `experience_fit`, `location_score`, `behavioral`) will be defaulted. To prevent these default values from distorting the results, when a candidate is detected as schema-agnostic (`is_agnostic = True`), their `final_score` will be computed directly as their `semantic_similarity` score.

## Proposed Changes

### Data Loader

#### [MODIFY] [data_loader.py](file:///d:/AI%20Recruiter%20Hackathon/AdvRecruiter/src/data_loader.py)
- Implement `serialize_dict_to_text(d)` to recursively turn any nested dictionary/list structure into a clean text block (e.g., removing technical keys like `candidate_id` and formatting keys as natural words).
- Implement recursive `find_candidate_id(d)` to dynamically search for an ID key (like `candidate_id`, `id`, `user_id`, etc.) across any nesting level.
- Update `extract_candidate_features(raw)` to detect the schema type:
  - If standard keys (`profile` or `redrob_signals`) are found, parse as normal.
  - If they are missing, run in **agnostic mode**:
    - Set `is_agnostic = True`.
    - Recursively search for `candidate_id`.
    - Serialize the entire JSON into `full_text` and `career_text`.
    - Set all other numeric and boolean signals to safe defaults (e.g. `years_exp = 0`, `is_honeypot = False`).

---

### Ranker

#### [MODIFY] [ranker.py](file:///d:/AI%20Recruiter%20Hackathon/AdvRecruiter/src/ranker.py)
- Update `compute_final_score(df)` to check for `is_agnostic`.
- For any candidate row where `is_agnostic == True`, set `final_score` directly to `semantic_similarity` instead of using the weighted formula and the title relevance gate multiplier.

---

### UI Application

#### [MODIFY] [app.py](file:///d:/AI%20Recruiter%20Hackathon/AdvRecruiter/app.py)
- Ensure that the ranking logic in the Gradio web interface (`rank_existing_database` and `rank_uploaded_resumes`) also checks for the `is_agnostic` flag and bypasses weighted linear combination for those candidates in the same way as `ranker.py`.

## Verification Plan

### Automated Tests
1. Create a test script in the scratch directory: [test_agnostic.py](file:///d:/AI%20Recruiter%20Hackathon/AdvRecruiter/scratch/test_agnostic.py) that:
   - Defines a mock candidate in a completely custom, arbitrary JSON format.
   - Runs `extract_candidate_features`.
   - Asserts `is_agnostic` is True, `candidate_id` is successfully resolved, and `full_text` contains serialized text of all keys.
   - Computes features and scores, verifying they run without exceptions and score the agnostic candidate based on semantic similarity.
2. Run the test script using `python scratch/test_agnostic.py`.
