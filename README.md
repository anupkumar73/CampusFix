# CampusFix — Ready-to-Run

CampusFix is a student campus-complaint workflow matching the supplied UI:
Landing → Login → Dashboard → Report → Smart Analysis → Duplicate Check → Success → My Reports → Tracking → Notifications → Feedback.

## Run

```cmd
cd /d D:\CampusFix\backend
npm install
npm start
```

Open `http://localhost:5000/`.

No MongoDB is required for the demo. If `MONGO_URI` is not set, CampusFix uses `backend/data/store.json` and persists demo data across server restarts.

[[Live](https://campusfix-diu7.onrender.com)]

## Demo login

Student:
- Email: `anup@college.edu`
- Password: any non-empty value

Admin:
- Email: `admin@campusfix.com`
- Password: any non-empty value

## Main API

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/complaints/analyze` — AI category/priority + duplicate detection + image upload
- `POST /api/complaints` — create complaint
- `GET /api/complaints/mine` — student's reports
- `GET /api/complaints/:ticketId` — tracking details
- `PATCH /api/complaints/:ticketId/status` — admin status update
- `PATCH /api/complaints/:ticketId/assign` — admin assignment
- `POST /api/complaints/:ticketId/support` — support duplicate
- `POST /api/complaints/:ticketId/verify` — student resolution verification
- `GET /api/notifications`
- `POST /api/feedback`
- `GET /api/admin/dashboard`

## Notes

- AI classification is a local rule-based fallback so the project works without an external AI key.
- Uploaded images are stored locally in `backend/uploads`.
- Socket.IO is enabled for complaint create/update events.
- For production, set a strong `JWT_SECRET`, configure MongoDB, and replace the local AI fallback with a hosted model if required.
