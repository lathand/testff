// Firebase Data Grabber - Console Script
// Copy and paste this entire script into the browser console on https://bgsitousd.netlify.app
// It will fetch all accessible Firebase data and download it as JSON

(async function() {
  const firebaseConfig = {
    apiKey: "AIzaSyA0i9ZO48mxV9e-RcpTSUSue5_RtY-Zki8",
    authDomain: "bgsihelp.firebaseapp.com",
    projectId: "bgsihelp",
    storageBucket: "bgsihelp.firebasestorage.app",
    messagingSenderId: "554608897166",
    appId: "1:554608897166:web:2d0bec29edfb135cecaddf"
  };

  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
  const { getFirestore, collection, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
  const { getAuth, signInAnonymously } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  console.log('🔥 Connecting to Firebase...');
  await signInAnonymously(auth);
  console.log('✅ Connected!');

  const allData = {};

  // Fetch known collections
  const collections = ['users', 'logins'];

  for (const colName of collections) {
    try {
      console.log(`📂 Fetching ${colName}...`);
      const snapshot = await getDocs(collection(db, colName));
      allData[colName] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(`✅ ${colName}: ${allData[colName].length} documents`);
    } catch (e) {
      console.log(`❌ ${colName}: ${e.message}`);
    }
  }

  console.log('📊 Complete data:', allData);

  // Download as JSON
  const blob = new Blob([JSON.stringify(allData, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'firebase-dump.json';
  a.click();
  URL.revokeObjectURL(url);

  console.log('💾 Downloaded firebase-dump.json');
})();</content>
<parameter name="filePath">c:\Users\Vhub2\Downloads\bgsi-site\console-script.js