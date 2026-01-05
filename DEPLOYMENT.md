# Deployment Guide

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages when code is pushed to the `main` branch.

### Setup Steps

1. **Enable GitHub Pages in Repository Settings:**
   - Go to repository Settings → Pages
   - Source: Select "GitHub Actions"

2. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Add deployment workflow"
   git push origin main
   ```

3. **Access your app:**
   - URL: https://camnx-fpt.github.io/test-map

### Manual Deployment

You can also trigger deployment manually:
- Go to Actions tab → Deploy to GitHub Pages → Run workflow

### Configuration

- **Homepage**: Set in `package.json` as `https://camnx-fpt.github.io/test-map`
- **Build folder**: `/build` (default for Create React App)
- **Node version**: 18.x
- **Branch**: `main`

### Troubleshooting

If deployment fails:
1. Check Actions tab for error logs
2. Ensure repository Settings → Pages → Source is set to "GitHub Actions"
3. Verify repository name matches the homepage URL
4. Check that all dependencies install correctly

### Local Testing

To test the production build locally:
```bash
npm run build
npx serve -s build
```
