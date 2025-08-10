# Data Model (Prisma)

User
- id (string, cuid), email (unique), passwordHash, createdAt

Item
- id, userId (fk), category (enum), color?, season?, formality?, imageUrl?, createdAt

Outfit
- id, userId, topId, bottomId, shoesId, accessoryIds (string[]), occasion?, temperatureRange?, score?, createdAt

CalendarEntry
- id, userId, outfitId, date

Feedback
- id, userId, outfitId, rating ('like'|'dislike'), reason?, createdAt
