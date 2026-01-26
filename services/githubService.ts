
export const syncToGist = async (token: string, gistId: string | undefined, data: any) => {
  const fileName = "omnisync_backup.json";
  const content = JSON.stringify(data, null, 2);

  const url = gistId 
    ? `https://api.github.com/gists/${gistId}` 
    : `https://api.github.com/gists`;

  const method = gistId ? 'PATCH' : 'POST';

  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: "OmniSync Pro App Data Backup",
      public: false,
      files: {
        [fileName]: {
          content: content
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`GitHub Sync Failed: ${response.statusText}`);
  }

  return await response.json();
};

export const fetchFromGist = async (token: string, gistId: string) => {
  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    }
  });

  if (!response.ok) return null;
  const gist = await response.json();
  const file = gist.files["omnisync_backup.json"];
  return file ? JSON.parse(file.content) : null;
};
