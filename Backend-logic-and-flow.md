# CareAI Backend Requirements & Flow

## 1. Project Overview

**Project Name:** CareAI

CareAI is a healthcare tracking web application that allows users to:

- Sign in with Google
- Create a personal health profile
- Record vital signs
- Receive AI-generated health insights
- View a health score
- Review trends and history

This document defines the backend requirements, Firebase architecture, data model, API/service flow, validation rules, and security requirements for the MVP.

---

# 2. Recommended Firebase Stack

Use the following Firebase services:

| Requirement | Firebase Service |
|---|---|
| Google Sign-In | Firebase Authentication |
| User/Profile Data | Cloud Firestore |
| Vital Readings | Cloud Firestore |
| AI Analysis Results | Cloud Firestore |
| Profile Images / Files | Firebase Storage |
| Backend Logic | Firebase Cloud Functions or server-side API |
| Hosting | Vercel for frontend or Firebase Hosting |
| Security | Firebase Auth + Firestore Security Rules |

> **Important:** Firebase Storage should not be used as the primary database.  
> Use **Cloud Firestore** for structured application data.  
> Use **Firebase Storage** only for files such as profile photos or uploaded documents/images.

---

# 3. MVP Backend Scope

The backend must support:

1. Google authentication
2. New-user detection
3. User profile creation
4. Profile retrieval/update
5. Vital reading creation
6. Vital reading history
7. Latest vital reading
8. Health score storage
9. AI analysis generation
10. AI analysis storage
11. Dashboard data retrieval
12. Authorization/security
13. Logout/session handling

---

# 4. User Flow

```text
Landing Page
    |
    v
Login
    |
    v
Continue with Google
    |
    v
Firebase Authentication
    |
    v
Authentication successful
    |
    v
Check Firestore for profile
   / \
  /   \
Exists   Missing
  |        |
  v        v
Dashboard  Create Profile
             |
             v
         Save Profile
             |
             v
          Dashboard
```

---

# 5. Main Application Flow

```text
User logs in
    |
    v
Dashboard
    |
    +----------------------------+
    |                            |
    v                            v
Vital Tracker                 History
    |                            |
    v                            v
Enter Vitals              Fetch Previous Logs
    |
    v
Validate Input
    |
    v
Save Reading
    |
    v
Generate Health Score
    |
    v
Send Safe Data to AI Service
    |
    v
Receive AI Insight
    |
    v
Save Analysis
    |
    v
Update Dashboard
```

---

# 6. Authentication Requirements

## 6.1 Authentication Provider

Use:

- Firebase Authentication
- Google Provider

Example frontend flow:

```text
User clicks "Continue with Google"
        |
        v
signInWithPopup()
or
signInWithRedirect()
        |
        v
Firebase returns authenticated user
        |
        v
Read user.uid
        |
        v
Check profiles/{uid}
```

---

## 6.2 Authentication Data

Firebase Authentication already provides values such as:

```json
{
  "uid": "firebase-user-id",
  "displayName": "User Name",
  "email": "user@example.com",
  "photoURL": "https://...",
  "providerId": "google.com"
}
```

Do not ask users to create another password.

Do not store Google passwords.

---

# 7. New User Detection

After Google login:

```javascript
const profileRef = doc(db, "profiles", user.uid);
const profileSnap = await getDoc(profileRef);

if (profileSnap.exists()) {
  navigate("/dashboard");
} else {
  navigate("/create-profile");
}
```

Backend/security rules must ensure users can access only their own profile.

---

# 8. Firestore Database Design

Recommended collections:

```text
profiles
vitalReadings
aiAnalyses
```

Alternative nested model:

```text
users/{uid}
users/{uid}/vitals/{readingId}
users/{uid}/analyses/{analysisId}
```

For the MVP, the nested user-based model is recommended because security rules are easier to reason about.

Recommended structure:

```text
users
  └── {uid}
      ├── profile fields
      ├── createdAt
      ├── updatedAt
      │
      ├── vitals
      │    └── {readingId}
      │
      └── analyses
           └── {analysisId}
```

---

# 9. User Profile Schema

Firestore path:

```text
users/{uid}
```

Example:

```json
{
  "uid": "firebase-user-id",
  "displayName": "Thuzar",
  "email": "thuzar@example.com",
  "photoURL": "https://...",
  "dateOfBirth": "2002-05-18",
  "sex": "female",
  "heightCm": 165,
  "weightKg": 55,
  "bloodType": "O+",
  "profileCompleted": true,
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

---

# 10. Profile Field Requirements

## Required

- displayName
- dateOfBirth
- sex
- heightCm
- weightKg

## Optional

- bloodType
- photoURL

## Do Not Collect for MVP

- home address
- national ID
- insurance number
- emergency contact
- full medical history
- medication list
- diagnosis history

Keep the onboarding lightweight.

---

# 11. Vital Reading Schema

Firestore path:

```text
users/{uid}/vitals/{readingId}
```

Example:

```json
{
  "systolic": 120,
  "diastolic": 80,
  "heartRate": 72,
  "oxygenSaturation": 98,
  "temperatureC": 36.7,
  "healthScore": 92,
  "status": "good",
  "createdAt": "serverTimestamp"
}
```

---

# 12. Vital Input Requirements

Required fields:

- systolic
- diastolic
- heartRate
- oxygenSaturation
- temperatureC

Do not trust frontend validation alone.

Validate again in backend/server logic.

---

# 13. Suggested Validation Rules

These are technical sanity checks, not diagnostic thresholds.

```text
Systolic:
numeric and reasonable

Diastolic:
numeric and reasonable

Heart Rate:
numeric and reasonable

Oxygen Saturation:
0–100

Temperature:
reasonable human body-temperature input
```

The backend should reject:

- null values
- NaN
- negative values
- impossible percentages
- malformed input
- unexpected strings

Avoid using validation rules as medical diagnosis.

---

# 14. Vital Submission Flow

```text
Vital Tracker
    |
    v
User enters values
    |
    v
Frontend validation
    |
    v
Backend validation
    |
    v
Create vital record
    |
    v
Calculate Health Score
    |
    v
Generate AI Analysis
    |
    v
Save AI result
    |
    v
Return:
- reading
- score
- status
- AI insight
    |
    v
Dashboard refresh
```

---

# 15. Health Score

Health score calculation should be deterministic and separated from the AI response.

Recommended architecture:

```text
Vital Reading
    |
    v
Rule-Based Score Engine
    |
    v
Health Score
    |
    +------------------+
    |                  |
    v                  v
Dashboard          AI Context
```

Do not ask the LLM to generate the numerical health score unless that is explicitly part of your product design.

For an MVP, a rule-based score is easier to:

- test
- debug
- explain
- reproduce

---

# 16. AI Analysis Requirements

CareAI will use **OpenRouter** as the AI gateway/provider for generating informational health insights from validated vital data.

The OpenRouter call must happen **server-side only** through Firebase Cloud Functions or another protected backend service.

Never call OpenRouter directly from the browser with a secret API key.

Recommended environment variables:

```env
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
OPENROUTER_SITE_URL=https://your-careai-domain.com
OPENROUTER_APP_NAME=CareAI
```

`OPENROUTER_MODEL` should contain the exact OpenRouter model slug selected for the project, for example:

```env
OPENROUTER_MODEL=openai/gpt-5-chat
```

Keep the model configurable through environment variables so the application can switch models without changing frontend code.

AI should generate informational guidance from validated vital data.

The AI output may contain:

```text
summary
whatLooksGood[]
areasToWatch[]
recommendations[]
disclaimer
```

Example response structure:

```json
{
  "summary": "Most of your readings are within the app's typical reference range.",
  "whatLooksGood": [
    "Oxygen saturation looks consistent.",
    "Heart rate is within the app's reference range."
  ],
  "areasToWatch": [
    "Your blood pressure reading may be worth rechecking."
  ],
  "recommendations": [
    "Rest for a few minutes and measure again while seated.",
    "Track readings consistently to identify trends."
  ],
  "disclaimer": "CareAI provides informational health insights and is not a substitute for professional medical advice."
}
```

---

# 17. OpenRouter Integration

## 17.1 OpenRouter Endpoint

Use the OpenRouter chat-completions endpoint:

```text
POST https://openrouter.ai/api/v1/chat/completions
```

Required headers:

```http
Authorization: Bearer <OPENROUTER_API_KEY>
Content-Type: application/json
```

Optional OpenRouter attribution headers:

```http
HTTP-Referer: https://your-careai-domain.com
X-Title: CareAI
```

The model must be read from:

```text
OPENROUTER_MODEL
```

Do not hardcode the model identifier throughout the application.

---

## 17.2 OpenRouter Request Flow

```text
Vital Tracker
    |
    v
Frontend submits validated-looking input
    |
    v
Firebase Auth ID Token
    |
    v
Firebase Cloud Function / Backend
    |
    +--> Verify Firebase token
    |
    +--> Validate vital values
    |
    +--> Calculate deterministic Health Score
    |
    +--> Build minimal AI prompt
    |
    +--> OpenRouter API
    |
    v
Structured AI response
    |
    +--> Validate / normalize AI output
    |
    +--> Save analysis to Firestore
    |
    v
Return safe response to frontend
```

---

## 17.3 Example OpenRouter Server Request

Example Node.js server-side implementation:

```javascript
const response = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "",
      "X-Title": process.env.OPENROUTER_APP_NAME || "CareAI"
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL,
      messages: [
        {
          role: "system",
          content: "You are CareAI, an informational health insight assistant. Do not diagnose. Return concise, cautious, structured health guidance."
        },
        {
          role: "user",
          content: JSON.stringify({
            systolic: 120,
            diastolic: 80,
            heartRate: 72,
            oxygenSaturation: 98,
            temperatureC: 36.7,
            healthScore: 92
          })
        }
      ]
    })
  }
);

if (!response.ok) {
  throw new Error("OpenRouter request failed");
}

const data = await response.json();
const content = data?.choices?.[0]?.message?.content;
```

Use real validated values at runtime.

Never put the OpenRouter API key in frontend code.

---

## 17.4 Recommended Structured AI Output

CareAI should request and normalize the model output into a predictable application structure.

Target shape:

```json
{
  "summary": "Most of your readings are within the app's typical reference range.",
  "whatLooksGood": [
    "Heart rate looks consistent.",
    "Oxygen saturation is within the app's reference range."
  ],
  "areasToWatch": [
    "Consider rechecking your blood pressure if the reading remains elevated."
  ],
  "recommendations": [
    "Rest for a few minutes before measuring again.",
    "Track readings consistently to identify trends."
  ],
  "urgency": "routine",
  "disclaimer": "CareAI provides informational health insights and is not a substitute for professional medical advice."
}
```

Recommended `urgency` values:

```text
routine
monitor
seek-care
```

Do not let the model create arbitrary severity labels that the UI interprets as medical diagnoses.

The backend must validate the returned JSON before saving it.

---

## 17.5 OpenRouter Prompt Requirements

The backend prompt should tell the model to:

- provide informational guidance only
- avoid diagnosis
- avoid claiming certainty
- avoid saying a user is definitely safe
- avoid medication prescribing
- avoid changing medication instructions
- avoid emergency claims unless the input clearly warrants urgent escalation according to your predefined application policy
- keep recommendations short
- use plain language
- return only the required structured fields
- use the deterministic Health Score supplied by the backend instead of generating a new score

The prompt should include only the information required for analysis.

For the MVP, send:

```text
age or date-derived age if needed
sex if needed for the chosen analysis rules
systolic
diastolic
heart rate
oxygen saturation
temperature
deterministic health score
recent trend summary if available
```

Avoid sending:

```text
email
Google ID
full name
profile image URL
Firebase UID
unrelated personal profile information
```

---

## 17.6 OpenRouter Failure Handling

If OpenRouter is unavailable:

```text
Vital reading saved
    |
    v
AI request fails
    |
    v
Do NOT delete the vital reading
    |
    v
Store analysis status = failed/pending
    |
    v
Show:
"Your reading was saved, but CareAI analysis is temporarily unavailable."
```

The user should not lose their vital reading because the AI provider failed.

Recommended analysis state:

```json
{
  "status": "completed | pending | failed",
  "provider": "openrouter",
  "model": "configured-model-slug",
  "errorCode": null
}
```

Do not store raw provider error details that may contain sensitive implementation information.

---

## 17.7 Retry Strategy

For an MVP:

- one initial OpenRouter request
- optionally one safe retry for network/5xx failure
- no infinite retry loop
- no retry for malformed user input
- use request timeout
- prevent duplicate submissions

Keep retries server-side.

---

## 17.8 Cost and Model Control

Because OpenRouter supports multiple models, keep model selection configurable.

```env
OPENROUTER_MODEL=<model-slug>
```

Do not expose a user-controlled raw model slug to the backend unless you intentionally support multiple approved models.

For MVP:

```text
one approved model
one server-side configuration
one consistent response schema
```

This makes output easier to test and keeps cost predictable.

---

# 18. AI Safety Requirements

The AI must not present itself as making a confirmed medical diagnosis.

Avoid output such as:

```text
"You have hypertension."
"You are safe."
"You definitely have..."
```

Prefer:

```text
"This reading is outside the app's typical reference range."
"Consider rechecking the measurement."
"If you are concerned or experiencing symptoms, seek professional medical care."
```

Never send more personal information to the AI service than necessary.

---

# 19. AI Analysis Storage

Firestore path:

```text
users/{uid}/analyses/{analysisId}
```

Example:

```json
{
  "readingId": "vital-reading-id",
  "healthScore": 92,
  "summary": "Your latest readings look mostly stable.",
  "whatLooksGood": [
    "Heart rate looks consistent.",
    "Oxygen saturation is within the reference range."
  ],
  "areasToWatch": [],
  "recommendations": [
    "Continue tracking at a similar time each day."
  ],
  "model": "configured-ai-model",
  "createdAt": "serverTimestamp"
}
```

---

# 20. Relationship Between Reading and Analysis

Recommended relationship:

```text
Vital Reading
readingId = abc123

AI Analysis
readingId = abc123
```

This makes it easy to retrieve the analysis belonging to one reading.

---

# 21. Dashboard Data Requirements

Dashboard should fetch:

1. authenticated user profile
2. latest vital reading
3. latest health score
4. latest AI analysis
5. recent readings
6. recent trend data

Example:

```text
Dashboard Load
    |
    +--> users/{uid}
    |
    +--> users/{uid}/vitals
    |       orderBy createdAt desc
    |
    +--> users/{uid}/analyses
            orderBy createdAt desc
```

---

# 22. Dashboard Backend Flow

```text
Open Dashboard
    |
    v
Verify Firebase User
    |
    v
Get Profile
    |
    v
Get Latest Reading
    |
    v
Get Recent Readings
    |
    v
Get Latest Analysis
    |
    v
Build Dashboard State
    |
    v
Render:
- Health Score
- Vital Cards
- Trends
- AI Insight
- Recent Logs
```

---

# 23. Vital Tracker Backend Flow

```text
Open Vital Tracker
    |
    v
Check Authentication
    |
    v
Load Last Reading (optional)
    |
    v
User enters values
    |
    v
Submit
    |
    v
Validate
    |
    v
Calculate Score
    |
    v
Create Firestore Reading
    |
    v
Request AI Analysis
    |
    v
Create Firestore Analysis
    |
    v
Return Success
```

---

# 24. History Backend Flow

```text
Open History
    |
    v
Verify Authentication
    |
    v
Query:
users/{uid}/vitals
    |
    v
orderBy(createdAt, desc)
    |
    v
Display Logs
```

For each history item, optionally fetch its matching analysis using:

```text
readingId
```

---

# 25. Recommended Query Patterns

## Latest Reading

```javascript
query(
  collection(db, "users", uid, "vitals"),
  orderBy("createdAt", "desc"),
  limit(1)
)
```

## Recent Readings

```javascript
query(
  collection(db, "users", uid, "vitals"),
  orderBy("createdAt", "desc"),
  limit(10)
)
```

## History

```javascript
query(
  collection(db, "users", uid, "vitals"),
  orderBy("createdAt", "desc")
)
```

---

# 26. Firebase Storage Usage

Firebase Storage should be used only for files.

Example:

```text
users/{uid}/profile/avatar.jpg
```

Possible future files:

- profile image
- health-report image
- document upload

Do not store structured vital records as JSON files in Firebase Storage.

Use Firestore instead.

---

# 27. Backend Logic Options

## Option A — Firebase Cloud Functions + OpenRouter (Recommended)

Recommended for this CareAI MVP because Firebase Authentication, Firestore, and Cloud Functions stay in one ecosystem while OpenRouter is called securely from the server.

Use Cloud Functions for:

- OpenRouter API calls
- protected server logic
- validation
- score calculation
- secure secrets

Flow:

```text
React
  |
  v
Firebase Function
  |
  +--> Validate Firebase token
  |
  +--> Validate vitals
  |
  +--> Calculate score
  |
  +--> Call AI API
  |
  +--> Save Firestore
  |
  v
Return result
```

## Option B — Node.js API

If you already have a Node/Express backend:

```text
React
    |
    v
Node.js API
    |
    v
Firebase Admin SDK
    |
    +--> Firestore
    |
    +--> AI Provider
```

For a small MVP, Firebase Cloud Functions can reduce infrastructure work.

---

# 28. Firebase Admin SDK

Server-side code should use Firebase Admin SDK.

Backend should verify the Firebase ID token.

Flow:

```text
Frontend
    |
    v
Firebase Auth
    |
    v
ID Token
    |
    v
Backend
    |
    v
Firebase Admin verifyIdToken()
    |
    v
Trusted uid
```

Never trust a user-provided UID by itself.

---

# 29. Protected API Flow

Frontend:

```http
Authorization: Bearer <firebase-id-token>
```

Backend:

```javascript
const decodedToken = await admin.auth().verifyIdToken(token);
const uid = decodedToken.uid;
```

Then access:

```text
users/{uid}
users/{uid}/vitals
users/{uid}/analyses
```

---

# 30. Security Requirements

Every authenticated resource must be scoped to:

```text
request.auth.uid
```

Users must never be able to:

- read another user's profile
- read another user's vitals
- write another user's vitals
- read another user's AI analysis
- update another user's profile

---

# 31. Example Firestore Security Rules

Initial example:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {

      allow read, create, update:
        if request.auth != null
        && request.auth.uid == userId;

      allow delete: if false;

      match /vitals/{readingId} {
        allow read, create:
          if request.auth != null
          && request.auth.uid == userId;

        allow update, delete: if false;
      }

      match /analyses/{analysisId} {
        allow read:
          if request.auth != null
          && request.auth.uid == userId;

        // Prefer server/Admin SDK writes for AI analyses.
        allow write: if false;
      }
    }
  }
}
```

Review and tighten these rules before production.

---

# 32. Server-Only AI Writes

Recommended:

```text
Frontend
    X
    |
    | Do not directly create AI analysis
    |
Backend / Cloud Function
    |
    v
Firestore
```

Why:

- prevents forged AI results
- protects API keys
- centralizes validation
- keeps AI output consistent

---

# 33. Environment Variables

Never commit secrets.

Frontend-safe Firebase config may include public Firebase project configuration.

Server secrets should include things such as:

```env
AI_API_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

Do not expose AI API keys in Vite frontend variables.

Anything using:

```text
VITE_
```

is visible to the browser.

---

# 34. Suggested Service Layer

Frontend structure:

```text
src/
├── firebase/
│   ├── config.js
│   ├── auth.js
│   └── firestore.js
│
├── services/
│   ├── authService.js
│   ├── profileService.js
│   ├── vitalService.js
│   ├── historyService.js
│   └── aiService.js
```

---

# 35. Suggested Backend Structure

If using Firebase Functions:

```text
functions/
├── src/
│   ├── index.js
│   ├── analyzeVitals.js
│   ├── healthScore.js
│   ├── validation.js
│   └── ai/
│       └── generateInsight.js
```

If using Express:

```text
server/
├── src/
│   ├── server.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── profile.js
│   │   ├── vitals.js
│   │   └── analysis.js
│   ├── services/
│   │   ├── firebaseAdmin.js
│   │   ├── healthScore.js
│   │   └── aiService.js
│   └── validation/
│       └── vitals.js
```

---

# 36. Suggested Endpoints

If using an Express/API backend:

## Profile

```http
GET /api/profile
POST /api/profile
PATCH /api/profile
```

## Vitals

```http
POST /api/vitals
GET /api/vitals
GET /api/vitals/latest
```

## Analysis

```http
POST /api/vitals/analyze
GET /api/analysis/latest
```

## Dashboard

Optional combined endpoint:

```http
GET /api/dashboard
```

This can return:

```json
{
  "profile": {},
  "latestReading": {},
  "healthScore": 92,
  "latestAnalysis": {},
  "recentReadings": []
}
```

---

# 37. Recommended MVP Submission Endpoint

For a 6-day MVP, a single protected operation can simplify the flow:

```http
POST /api/vitals/analyze
```

Request:

```json
{
  "systolic": 120,
  "diastolic": 80,
  "heartRate": 72,
  "oxygenSaturation": 98,
  "temperatureC": 36.7
}
```

Backend performs:

```text
Verify Auth
→ Validate
→ Score
→ Save Reading
→ AI Analyze
→ Save Analysis
→ Return Result
```

Response:

```json
{
  "success": true,
  "readingId": "abc123",
  "healthScore": 92,
  "status": "good",
  "analysis": {
    "summary": "...",
    "whatLooksGood": [],
    "areasToWatch": [],
    "recommendations": []
  }
}
```

---

# 38. Error Handling

Use consistent application errors.

Example:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_VITALS",
    "message": "Please check your readings and try again."
  }
}
```

Do not return stack traces to users.

---

# 39. Loading States

Frontend should support:

```text
Authentication loading
Profile loading
Dashboard loading
Saving vitals
Analyzing vitals
History loading
```

Do not allow multiple submissions while analysis is running.

---

# 40. Timestamps

Use Firebase server timestamps.

Example:

```javascript
serverTimestamp()
```

Do not rely only on the user's browser time for persisted timestamps.

---

# 41. Data Ownership

Every reading belongs to exactly one authenticated Firebase user.

Never accept:

```json
{
  "userId": "some-other-user-id"
}
```

as authoritative.

Instead:

```text
Firebase Token
    |
    v
Backend extracts uid
    |
    v
Save under authenticated uid
```

---

# 42. Profile Creation Flow

```text
Google Login
    |
    v
Firebase User
    |
    v
Check users/{uid}
    |
    v
Missing Profile
    |
    v
/create-profile
    |
    v
Validate Form
    |
    v
Save users/{uid}
    |
    v
profileCompleted = true
    |
    v
/dashboard
```

---

# 43. Existing User Flow

```text
Google Login
    |
    v
Firebase User
    |
    v
users/{uid} exists
AND
profileCompleted == true
    |
    v
/dashboard
```

---

# 44. Route Protection

## Public

```text
/
 /login
```

## Authenticated

```text
/create-profile
/dashboard
/add
/history
```

Additional behavior:

```text
Not Authenticated + Protected Route
→ /login

Authenticated + Profile Missing + Dashboard
→ /create-profile

Authenticated + Profile Complete + /create-profile
→ /dashboard
```

---

# 45. Logout Flow

```text
User clicks Sign Out
    |
    v
Firebase signOut()
    |
    v
Clear local app state
    |
    v
/login or /
```

Do not manually store auth tokens permanently if Firebase SDK already manages the session.

---

# 46. Dashboard Query Optimization

For an MVP, load only what is needed.

Example:

```text
Latest reading: 1
Recent logs: 5
Trend readings: 7–30
Latest analysis: 1
```

Avoid loading the user's entire lifetime history on every dashboard visit.

---

# 47. Firestore Indexes

Firestore may request indexes when combining:

```text
where()
orderBy()
```

Create only required indexes.

For nested user collections, simple:

```text
orderBy(createdAt)
```

queries may require minimal custom indexing.

---

# 48. MVP Logging

Backend may log:

- request ID
- operation success/failure
- timestamps
- non-sensitive technical errors

Avoid logging:

- full health profile
- full vital payload
- AI prompt containing personal data
- authentication tokens

---

# 49. Minimum Security Checklist

Before deployment:

- [ ] Google Auth enabled
- [ ] Unauthorized users blocked
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Users cannot access other users' data
- [ ] OpenRouter API key only exists server-side
- [ ] `OPENROUTER_MODEL` configured server-side
- [ ] Frontend never calls OpenRouter directly with a secret key
- [ ] Firebase Admin credentials not committed
- [ ] Vital input validated server-side
- [ ] AI output stored through trusted backend
- [ ] HTTPS used
- [ ] No sensitive data in URL
- [ ] No sensitive data in console logs
- [ ] Profile data not stored in localStorage
- [ ] Test logout
- [ ] Test expired session
- [ ] Test new-user redirect
- [ ] Test existing-user redirect

---

# 50. Recommended MVP Architecture

```text
                    ┌──────────────────┐
                    │      React       │
                    │      Vite        │
                    │    Tailwind      │
                    └────────┬─────────┘
                             |
             ┌───────────────┼────────────────┐
             |               |                |
             v               v                v
      Firebase Auth      Firestore       Firebase Storage
       Google Login      User Data        Profile Files
             |
             v
      Firebase ID Token
             |
             v
     Cloud Function / API
             |
       ┌─────┴──────┐
       |            |
       v            v
 Health Score     OpenRouter
     Logic         AI API
       |             |
       └──────┬──────┘
              |
              v
          Firestore
              |
              v
          Dashboard
```

---

# 51. Recommended Firestore Structure

```text
users
└── {uid}
    ├── displayName
    ├── email
    ├── photoURL
    ├── dateOfBirth
    ├── sex
    ├── heightCm
    ├── weightKg
    ├── bloodType
    ├── profileCompleted
    ├── createdAt
    ├── updatedAt
    │
    ├── vitals
    │   ├── reading_001
    │   │   ├── systolic
    │   │   ├── diastolic
    │   │   ├── heartRate
    │   │   ├── oxygenSaturation
    │   │   ├── temperatureC
    │   │   ├── healthScore
    │   │   ├── status
    │   │   └── createdAt
    │   │
    │   └── reading_002
    │
    └── analyses
        ├── analysis_001
        │   ├── readingId
        │   ├── summary
        │   ├── whatLooksGood
        │   ├── areasToWatch
        │   ├── recommendations
        │   └── createdAt
        │
        └── analysis_002
```

---

# 52. MVP Acceptance Criteria

The backend is MVP-ready when all of the following work:

## Authentication

- [ ] User can sign in with Google
- [ ] Firebase session persists
- [ ] User can sign out

## Profile

- [ ] New user is redirected to Create Profile
- [ ] Profile can be saved
- [ ] Existing profile can be loaded
- [ ] Existing user skips onboarding

## Vitals

- [ ] User can enter vitals
- [ ] Backend validates vitals
- [ ] Reading saves to Firestore
- [ ] Reading belongs only to authenticated user

## Analysis

- [ ] Health Score is calculated
- [ ] AI insight is generated
- [ ] AI insight is saved
- [ ] AI API key is not exposed to client

## Dashboard

- [ ] Latest values display
- [ ] Health Score displays
- [ ] AI Insight displays
- [ ] Recent readings display
- [ ] Trends use real history

## History

- [ ] User can view previous readings
- [ ] Readings sorted newest first
- [ ] User cannot access another user's history

## Responsive App

- [ ] Backend loading states handled
- [ ] API errors handled
- [ ] No duplicate submission
- [ ] Logout correctly clears UI state

---

# 53. Suggested 6-Day Backend Plan

## Day 1 — Firebase Setup

- Create Firebase project
- Enable Google Authentication
- Configure React Firebase SDK
- Set up Firestore
- Create initial security rules
- Implement auth state

## Day 2 — User Profile

- New/existing user check
- Create Profile flow
- Save user profile
- Protect routes
- Test refresh behavior

## Day 3 — Vitals

- Create vital schema
- Build vital service
- Validate readings
- Save readings
- Fetch latest reading
- Build history query

## Day 4 — Health Score + AI

- Implement deterministic score logic
- Build protected AI endpoint/function
- Generate structured analysis
- Save analysis
- Handle errors/timeouts

## Day 5 — Dashboard Integration

- Fetch latest reading
- Fetch recent readings
- Fetch latest analysis
- Build trends
- Integrate dashboard
- Integrate history

## Day 6 — Security & Deployment

- Test Firestore rules
- Test unauthorized access
- Test Google login/logout
- Test new/existing users
- Test invalid vitals
- Test AI failure handling
- Deploy
- Final QA

---

# 54. Recommended Final MVP Stack

```text
Frontend
React + Vite
Tailwind CSS
Framer Motion

Authentication
Firebase Authentication
Google Provider

Database
Cloud Firestore

File Storage
Firebase Storage

Backend
Firebase Cloud Functions
or
Node.js + Express

Server Firebase Access
Firebase Admin SDK

AI
OpenRouter
Server-side OpenRouter API call only
Configurable model via OPENROUTER_MODEL

Hosting
Vercel for frontend
Firebase / Google Cloud for backend functions
```

---


# 55. OpenRouter Environment Configuration

Recommended server-side environment configuration:

```env
OPENROUTER_API_KEY=your-secret-key
OPENROUTER_MODEL=your-approved-model-slug
OPENROUTER_SITE_URL=https://your-careai-domain.com
OPENROUTER_APP_NAME=CareAI
```

If using Firebase Functions, store secrets using the supported Firebase/Google Cloud secret-management mechanism rather than committing `.env` files to source control.

Frontend environment variables must NOT contain:

```text
OPENROUTER_API_KEY
Firebase Admin private key
other backend-only secrets
```

The public Firebase web configuration is different from a secret backend credential and can remain in the frontend configuration as required by Firebase.

---

# 56. OpenRouter Acceptance Criteria

OpenRouter integration is MVP-ready when:

- [ ] OpenRouter is called only from trusted backend code
- [ ] Firebase ID token is verified before analysis
- [ ] OpenRouter API key is not present in browser bundles
- [ ] Model is configured through `OPENROUTER_MODEL`
- [ ] Vital input is validated before the OpenRouter call
- [ ] Health Score is calculated independently of the LLM
- [ ] Prompt sends only necessary health context
- [ ] AI response is normalized to a known schema
- [ ] Malformed AI output is handled safely
- [ ] Provider failure does not delete the user's reading
- [ ] Timeout handling exists
- [ ] Duplicate AI submissions are prevented
- [ ] Saved analyses include provider/model metadata
- [ ] UI shows informational-not-medical disclaimer
- [ ] No raw OpenRouter error details are shown to users

---

# 57. Final Backend Principle

Keep the MVP architecture simple:

```text
Authenticate
    ↓
Identify User
    ↓
Store Profile
    ↓
Record Vitals
    ↓
Validate
    ↓
Calculate Score
    ↓
Generate AI Insight
    ↓
Store Result
    ↓
Display Dashboard
    ↓
Build History Over Time
```

The backend should remain the trusted layer for:

- user identity
- sensitive writes
- health score calculation
- AI requests
- validation
- authorization

The frontend should focus on:

- input
- presentation
- interaction
- responsive UI
