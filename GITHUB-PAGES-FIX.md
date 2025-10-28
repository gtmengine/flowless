# GitHub Pages 404 Fix

## ✅ Files Updated

I've copied the privacy policy and landing page to the **root directory** of your repository:
- ✅ **index.html** - Landing page (root)
- ✅ **privacy.html** - Privacy policy (root)
- ✅ **docs/index.html** - Landing page (docs folder)
- ✅ **docs/privacy.html** - Privacy policy (docs folder)

---

## 🔧 Fix GitHub Pages Settings

The 404 error is likely because GitHub Pages is configured incorrectly. Here's how to fix it:

### Option 1: Use Root Directory (Recommended)

1. Go to: **https://github.com/gtmengine/flowless/settings/pages**
2. Under "Build and deployment":
   - **Source:** Deploy from a branch
   - **Branch:** main
   - **Folder:** **/ (root)** ← Select this instead of /docs
3. Click **Save**
4. Wait 1-2 minutes

### Option 2: Use Docs Folder

1. Go to: **https://github.com/gtmengine/flowless/settings/pages**
2. Under "Build and deployment":
   - **Source:** Deploy from a branch
   - **Branch:** main
   - **Folder:** **/docs**
3. Click **Save**
4. Wait 1-2 minutes

---

## 🔗 Your URLs (after fixing)

**Privacy Policy:**
```
https://gtmengine.github.io/flowless/privacy.html
```

**Landing Page:**
```
https://gtmengine.github.io/flowless/
```

---

## ⚡ Quick Links

- **Fix Pages Settings:** https://github.com/gtmengine/flowless/settings/pages
- **Check Repository:** https://github.com/gtmengine/flowless

---

## 🆘 Still Getting 404?

### Check These:

1. **Repository is Public?**
   - Go to: https://github.com/gtmengine/flowless/settings
   - If it says "Private", change to "Public"

2. **Correct Branch Selected?**
   - Make sure "main" is selected, not "master"

3. **Wait Full 2 Minutes**
   - GitHub Pages can take up to 2 minutes to deploy

4. **Clear Browser Cache**
   - Try opening in incognito/private mode
   - Or press Ctrl+F5 to hard refresh

### Force Rebuild

If still not working:
1. Go to Settings → Pages
2. Change folder from "/ (root)" to "/docs"
3. Click Save
4. Wait 30 seconds
5. Change back to "/ (root)"
6. Click Save
7. Wait 2 minutes

---

## ✅ Test These URLs

After fixing, these should work:
- https://gtmengine.github.io/flowless/
- https://gtmengine.github.io/flowless/privacy.html

---

## 📞 Next Steps

Once the pages are working:
1. Copy the privacy policy URL for Chrome Web Store
2. Continue with extension submission
3. The privacy policy will be live and compliant!

**The fix should work within 2 minutes of changing the settings!**
