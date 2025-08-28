-- Add images/thumbnail/alt columns and versioning support for portfolios
ALTER TABLE portfolios
  ADD COLUMN IF NOT EXISTS images TEXT NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS thumbnail TEXT,
  ADD COLUMN IF NOT EXISTS alt TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_by TEXT;

-- Track Google Sheets versions for sections
CREATE TABLE IF NOT EXISTS sheet_versions (
  section TEXT PRIMARY KEY,
  sheet_modified TIMESTAMP WITH TIME ZONE,
  db_synced TIMESTAMP WITH TIME ZONE
);
