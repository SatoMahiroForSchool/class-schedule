// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Firebase 初始化（用於 index1.html 以 CDN 方式載入 firebase-app-compat.js 與 firebase-firestore-compat.js）

const firebaseConfig = {
  apiKey: "AIzaSyC8hd8CMFJ0RYryHHRyrWBybAbC2_ZVk7g",
  authDomain: "class-schdule.firebaseapp.com",
  projectId: "class-schdule",
  storageBucket: "class-schdule.firebasestorage.app",
  messagingSenderId: "56632491508",
  appId: "1:56632491508:web:c4232280f96661ef590da1",
  measurementId: "G-7SM74SLL9J"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
// 初始化 Firestore
const db = firebase.firestore();

let grades = ['一甲', '二甲', '三甲', '四甲', '五甲', '六甲'];
let baseSubjects = ["國語", "數學", "生活", "社會", "自然", "體育", "美勞", "英語", "綜合", "資訊", "音樂", "閩南語", "健康", "彈性"];
let subjects = [
  // 一年級
  { name: "一甲國語", count: 6 },
  { name: "一甲數學", count: 4 },
  { name: "一甲生活", count: 4 },
  { name: "一甲閩南語", count: 1 },
  { name: "一甲健康", count: 1 },
  { name: "一甲體育", count: 2 },
  { name: "一甲彈性", count: 3 },
  { name: "一甲美勞", count: 2 },

  // 二年級
  { name: "二甲國語", count: 6 },
  { name: "二甲數學", count: 4 },
  { name: "二甲生活", count: 4 },
  { name: "二甲閩南語", count: 1 },
  { name: "二甲健康", count: 1 },
  { name: "二甲體育", count: 2 },
  { name: "二甲彈性", count: 3 },
  { name: "二甲美勞", count: 2 },

  // 三年級
  { name: "三甲國語", count: 5 },
  { name: "三甲數學", count: 4 },
  { name: "三甲自然", count: 3 },
  { name: "三甲社會", count: 3 },
  { name: "三甲英語", count: 1 },
  { name: "三甲閩南語", count: 1 },
  { name: "三甲健康", count: 1 },
  { name: "三甲體育", count: 2 },
  { name: "三甲綜合", count: 2 },
  { name: "三甲美術", count: 2 },
  { name: "三甲音樂", count: 1 },
  { name: "三甲資訊", count: 1 },
  { name: "三甲彈性", count: 3 },

  // 四年級
  { name: "四甲國語", count: 5 },
  { name: "四甲數學", count: 4 },
  { name: "四甲自然", count: 3 },
  { name: "四甲社會", count: 3 },
  { name: "四甲英語", count: 1 },
  { name: "四甲閩南語", count: 1 },
  { name: "四甲健康", count: 1 },
  { name: "四甲體育", count: 2 },
  { name: "四甲綜合", count: 2 },
  { name: "四甲美術", count: 2 },
  { name: "四甲音樂", count: 1 },
  { name: "四甲資訊", count: 1 },
  { name: "四甲彈性", count: 3 },

  // 五年級
  { name: "五甲國語", count: 5 },
  { name: "五甲數學", count: 4 },
  { name: "五甲自然", count: 3 },
  { name: "五甲社會", count: 3 },
  { name: "五甲英語", count: 2 },
  { name: "五甲閩南語", count: 1 },
  { name: "五甲健康", count: 1 },
  { name: "五甲體育", count: 2 },
  { name: "五甲綜合", count: 2 },
  { name: "五甲美術", count: 2 },
  { name: "五甲音樂", count: 1 },
  { name: "五甲資訊", count: 1 },
  { name: "五甲彈性", count: 5 },

  // 六年級
  { name: "六甲國語", count: 5 },
  { name: "六甲數學", count: 4 },
  { name: "六甲自然", count: 3 },
  { name: "六甲社會", count: 3 },
  { name: "六甲英語", count: 2 },
  { name: "六甲閩南語", count: 1 },
  { name: "六甲健康", count: 1 },
  { name: "六甲體育", count: 2 },
  { name: "六甲綜合", count: 2 },
  { name: "六甲美術", count: 2 },
  { name: "六甲音樂", count: 1 },
  { name: "六甲資訊", count: 1 },
  { name: "六甲彈性", count: 5 }
];

// 其餘班級科目可用 0 或不加入

// 老師資料
let teachers = [
  "蔡玫", "顏毓明", "許慧菁", "余秋蕙", "張素月", "林怡妏", "王耀德", "鄭宇利", "陳禹雯",
  "劉羿廷", "李如凰", "莊巧筠", "張梨原", "劉翰霖"
];

let days = ['週一', '週二', '週三', '週四', '週五'];
let periods = 7;
let currentGrade = 0;

// 課表內容（每格為 {subject, teacher} 或 null）
let schedule = [];
let history = [];
let redoStack = [];
let courseButtons = []; // 儲存課程按鈕區域
let teacherButtons = []; // 在 drawTable 前清空

function emptySchedule() {
  let arr = [];
  for (let p = 0; p < periods; p++) {
    let row = [];
    for (let d = 0; d < days.length; d++) {
      row.push({ subject: null, teacher: null });
    }
    arr.push(row);
  }
  return arr;
}

function setup() {
  let canvas = createCanvas(700, windowHeight * 0.8);
  canvas.parent('canvas-holder');
  textAlign(CENTER, CENTER);
  textSize(18);
  for (let i = 0; i < grades.length; i++) {
    schedule[i] = emptySchedule();
  }
  setupTeacherDropdown();
  setupSubjectDropdown();
  window.focus(); // 讓canvas立即獲得焦點
}

function draw() {
  background('#fff8e1'); // 與網頁背景一致，避免拖曳殘影
  drawTable();
  // 從下拉選單拖曳科目時顯示提示
  if (draggingSubjectName) {
    fill(255, 255, 200, 220);
    rect(mouseX - 40, mouseY - 20, 80, 40, 8);
    fill(0);
    text(draggingSubjectName, mouseX, mouseY);
  }
  // 從下拉選單拖曳老師時顯示提示
  if (draggingTeacherName) {
    fill(200, 230, 255, 220);
    rect(mouseX - 40, mouseY - 20, 80, 40, 8);
    fill(0);
    text(draggingTeacherName, mouseX, mouseY);
  }
  // 從課表拖曳時顯示提示
  if (draggingFromTable) {
    fill(255, 255, 200, 220);
    rect(mouseX - 40, mouseY - 20, 80, 40, 8);
    fill(0);
    text(draggingFromTable.subject, mouseX, mouseY);
  }
}

// 畫課表
function drawTable() {
  let startX = 60, startY = 80, cellW = 100, cellH = 50;
  fill('#1976d2');
  rect(startX, startY, cellW, cellH);
  fill(255);
  text('節次', startX + cellW / 2, startY + cellH / 2);
  for (let d = 0; d < days.length; d++) {
    fill('#1976d2');
    rect(startX + (d + 1) * cellW, startY, cellW, cellH);
    fill(255);
    text(days[d], startX + (d + 1.5) * cellW, startY + cellH / 2);
  }
  for (let p = 0; p < periods; p++) {
    fill('#90caf9');
    rect(startX, startY + (p + 1) * cellH, cellW, cellH);
    fill(0);
    text((p + 1), startX + cellW / 2, startY + (p + 1.5) * cellH);
    for (let d = 0; d < days.length; d++) {
      let cell = schedule[currentGrade][p][d];
      fill(255);
      rect(startX + (d + 1) * cellW, startY + (p + 1) * cellH, cellW, cellH);
      // 畫課程按鈕
      if (cell.subject) {
        // 新增一個HTML按鈕在canvas上方（或用自訂div覆蓋canvas）
        // 或用 hitTest + mousePressed/mouseDragged/mouseReleased 處理
        // 這裡用canvas hitTest方式
        // 記錄每個課程按鈕的區域
        courseButtons.push({
          x: startX + (d + 1) * cellW + 5,
          y: startY + (p + 1) * cellH + 5,
          w: cellW - 10,
          h: 18,
          subject: cell.subject,
          p, d
        });
        fill('#ffd54f');
        rect(startX + (d + 1) * cellW + 5, startY + (p + 1) * cellH + 5, cellW - 10, 18, 4);
        fill(0);
        text(cell.subject, startX + (d + 1.5) * cellW, startY + (p + 1) * cellH + 14);
      }
      // 畫老師按鈕
      if (cell.teacher) {
        teacherButtons.push({
          x: startX + (d + 1) * cellW + 5,
          y: startY + (p + 1) * cellH + 27,
          w: cellW - 10,
          h: 18,
          teacher: cell.teacher,
          p, d
        });
        fill('#81d4fa');
        rect(startX + (d + 1) * cellW + 5, startY + (p + 1) * cellH + 27, cellW - 10, 18, 4);
        fill(0);
        text(cell.teacher, startX + (d + 1.5) * cellW, startY + (p + 1) * cellH + 36);
      }
    }
  }
}

// 右側老師與科目下拉選單
function setupTeacherPanel() {
  const teacherList = document.getElementById('teacher-list');
  teacherList.innerHTML = '';
  teachers.forEach(name => {
    let div = document.createElement('div');
    div.innerText = name;
    div.className = 'draggable-teacher';
    div.style.cursor = 'grab';
    div.draggable = true;
    div.ondragstart = (e) => {
      draggingTeacher = name;
      e.dataTransfer.setData('text/plain', name);
    };
    teacherList.appendChild(div);
  });
}

// 右側科目清單只顯示當前年級的科目
function setupSubjectPanel() {
  const subjectList = document.getElementById('subject-list');
  subjectList.innerHTML = '';
  subjects.filter(sub => sub.name.startsWith(grades[currentGrade]))
    .forEach((sub) => {
      let div = document.createElement('div');
      div.innerText = `${sub.name.replace(grades[currentGrade], '')} (${sub.count})`;
      div.className = 'draggable-subject';
      div.style.cursor = 'grab';
      div.draggable = true;
      div.ondragstart = (e) => {
        draggingSubject = sub.name; // 用名稱而非idx
        e.dataTransfer.setData('text/plain', sub.name);
      };
      subjectList.appendChild(div);
    });
}

// 註冊新帳號
function register(email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("註冊成功，歡迎 " + userCredential.user.email);
    })
    .catch((error) => {
      alert("註冊失敗：" + error.message);
    });
}

// 登入
function login(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("登入成功，歡迎 " + userCredential.user.email);
    })
    .catch((error) => {
      alert("登入失敗：" + error.message);
    });
}

// 登出
function logout() {
  firebase.auth().signOut().then(() => {
    alert("已登出");
  });
}

// 取得目前登入的使用者
function getCurrentUser() {
  return firebase.auth().currentUser;
}

// 儲存到雲端（依使用者分開）
function saveToCloud() {
  if (typeof db === "undefined") {
    alert("未載入雲端功能");
    return;
  }
  const user = getCurrentUser();
  if (!user) {
    alert("請先登入");
    return;
  }
  db.collection("schedules").doc(user.uid).set({
    schedule: schedule,
    subjects: subjects,
    timestamp: Date.now()
  }).then(() => {
    alert("已儲存到雲端！");
  }).catch((error) => {
    alert("儲存失敗：" + error);
  });
}

// 從雲端載入（依使用者分開）
function loadFromCloud() {
  if (typeof db === "undefined") {
    alert("未載入雲端功能");
    return;
  }
  const user = getCurrentUser();
  if (!user) {
    alert("請先登入");
    return;
  }
  db.collection("schedules").doc(user.uid).get().then((doc) => {
    if (doc.exists) {
      let data = doc.data();
      schedule = data.schedule;
      subjects = data.subjects;
      setupTeacherDropdown();
      setupSubjectDropdown();
      alert("已從雲端載入！");
    } else {
      alert("雲端無資料");
    }
  }).catch((error) => {
    alert("載入失敗：" + error);
  });
}

// 儲存到雲端
function saveToCloud() {
  if (typeof db === "undefined") {
    alert("未載入雲端功能");
    return;
  }
  db.collection("schedules").doc("mySchedule").set({
    schedule: schedule,
    subjects: subjects,
    timestamp: Date.now()
  }).then(() => {
    alert("已儲存到雲端！");
  }).catch((error) => {
    alert("儲存失敗：" + error);
  });
}

// 從雲端載入
function loadFromCloud() {
  if (typeof db === "undefined") {
    alert("未載入雲端功能");
    return;
  }
  db.collection("schedules").doc("mySchedule").get().then((doc) => {
    if (doc.exists) {
      let data = doc.data();
      schedule = data.schedule;
      subjects = data.subjects;
      setupTeacherDropdown();
      setupSubjectDropdown();
      alert("已從雲端載入！");
    } else {
      alert("雲端無資料");
    }
  }).catch((error) => {
    alert("載入失敗：" + error);
  });
}

// 拖曳邏輯
let draggingSubject = null; // 科目名稱
let draggingSubjectName = null; // 顯示用名稱
let draggingTeacher = null;
let draggingTeacherName = null; // 新增：顯示用名稱
let draggingFromTable = null; // {p, d, subject}
let draggingTeacherFromTable = null;

function mousePressed() {
  // 課程拖曳
  for (let btn of courseButtons) {
    if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
      draggingFromTable = { p: btn.p, d: btn.d, subject: btn.subject };
      return;
    }
  }
  // 老師拖曳
  for (let btn of teacherButtons) {
    if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
      draggingTeacherFromTable = { p: btn.p, d: btn.d, teacher: btn.teacher };
      draggingTeacherName = btn.teacher;
      return;
    }
  }
}

function mouseDragged() {
  if (draggingFromTable) {
    fill(255, 255, 200, 220);
    rect(mouseX - 40, mouseY - 20, 80, 40, 8);
    fill(0);
    text(draggingFromTable.subject, mouseX, mouseY);
  }
  if (draggingTeacherFromTable || draggingTeacherName) {
    fill(200, 230, 255, 220);
    rect(mouseX - 40, mouseY - 20, 80, 40, 8);
    fill(0);
    text(draggingTeacherName, mouseX, mouseY);
  }
}

function mouseReleased() {
  let startX = 60, startY = 80, cellW = 100, cellH = 50;
  for (let p = 0; p < periods; p++) {
    for (let d = 0; d < days.length; d++) {
      let x = startX + (d + 1) * cellW;
      let y = startY + (p + 1) * cellH;
      if (mouseX > x && mouseX < x + cellW && mouseY > y && mouseY < y + cellH) {
        let cell = schedule[currentGrade][p][d];
        // 拖曳科目
        if (draggingSubject && !cell.subject) {
          let subIdx = subjects.findIndex(s => s.name === draggingSubject);
          if (subIdx !== -1 && subjects[subIdx].count > 0) {
            saveHistory();
            cell.subject = subjects[subIdx].name;
            subjects[subIdx].count--;
            setupSubjectDropdown();
          } else {
            alert('該科目已用完');
          }
        }
        // 拖曳老師
        if (draggingTeacher && !cell.teacher) {
          saveHistory();
          cell.teacher = draggingTeacher;
        }
      }
    }
  }
  // 新增：如果有 draggingFromTable
  if (draggingFromTable) {
    let dropped = false;
    for (let p = 0; p < periods; p++) {
      for (let d = 0; d < days.length; d++) {
        let x = startX + (d + 1) * cellW;
        let y = startY + (p + 1) * cellH;
        // 如果拖到課表其他空格
        if (mouseX > x && mouseX < x + cellW && mouseY > y && mouseY < y + cellH) {
          if (!schedule[currentGrade][p][d].subject) {
            // 移動課程
            saveHistory();
            schedule[currentGrade][p][d].subject = draggingFromTable.subject;
            schedule[currentGrade][draggingFromTable.p][draggingFromTable.d].subject = null;
            dropped = true;
            break;
          }
        }
      }
      if (dropped) break;
    }
    // 如果沒丟到課表格子，代表是移除
    if (!dropped) {
      saveHistory();
      // 找到對應科目+1
      let subIdx = subjects.findIndex(s => s.name === draggingFromTable.subject);
      if (subIdx !== -1) subjects[subIdx].count++;
      schedule[currentGrade][draggingFromTable.p][draggingFromTable.d].subject = null;
      setupSubjectDropdown();
    }
    draggingFromTable = null;
  }

  // 老師從下拉式選單拖曳
  if (draggingTeacher && !draggingTeacherFromTable) {
    for (let p = 0; p < periods; p++) {
      for (let d = 0; d < days.length; d++) {
        let x = startX + (d + 1) * cellW;
        let y = startY + (p + 1) * cellH;
        let cell = schedule[currentGrade][p][d];
        if (mouseX > x && mouseX < x + cellW && mouseY > y && mouseY < y + cellH) {
          if (!cell.teacher) {
            saveHistory();
            cell.teacher = draggingTeacher;
          }
        }
      }
    }
  }

  // 老師從課表拖曳
  if (draggingTeacherFromTable) {
    let dropped = false;
    for (let p = 0; p < periods; p++) {
      for (let d = 0; d < days.length; d++) {
        let x = startX + (d + 1) * cellW;
        let y = startY + (p + 1) * cellH;
        let cell = schedule[currentGrade][p][d];
        if (mouseX > x && mouseX < x + cellW && mouseY > y && mouseY < y + cellH) {
          if (!cell.teacher) {
            saveHistory();
            cell.teacher = draggingTeacherFromTable.teacher;
            schedule[currentGrade][draggingTeacherFromTable.p][draggingTeacherFromTable.d].teacher = null;
            dropped = true;
            break;
          }
        }
      }
      if (dropped) break;
    }
    // 如果沒丟到課表格子，代表移除
    if (!dropped) {
      saveHistory();
      schedule[currentGrade][draggingTeacherFromTable.p][draggingTeacherFromTable.d].teacher = null;
    }
    draggingTeacherFromTable = null;
  }

  draggingSubject = null;
  draggingSubjectName = null;
  draggingTeacher = null;
  draggingTeacherName = null;
}

function setGrade(idx) {
  currentGrade = idx;
  setupSubjectDropdown();
  setupTeacherDropdown();
  // 高亮顯示當前年級
  document.querySelectorAll('#grade-tabs button').forEach((btn, i) => {
    btn.classList.toggle('active', i === idx);
  });
}

function saveHistory() {
  // 一起存 schedule 和 subjects
  history.push(JSON.stringify({
    schedule: schedule,
    subjects: subjects
  }));
  redoStack = [];
}

function undo() {
  if (history.length > 0) {
    redoStack.push(JSON.stringify({
      schedule: schedule,
      subjects: subjects
    }));
    let last = JSON.parse(history.pop());
    schedule = JSON.parse(JSON.stringify(last.schedule));
    subjects = JSON.parse(JSON.stringify(last.subjects));
    setupTeacherDropdown();
    setupSubjectDropdown();
  }
}

function redo() {
  if (redoStack.length > 0) {
    history.push(JSON.stringify({
      schedule: schedule,
      subjects: subjects
    }));
    let next = JSON.parse(redoStack.pop());
    schedule = JSON.parse(JSON.stringify(next.schedule));
    subjects = JSON.parse(JSON.stringify(next.subjects));
    setupTeacherDropdown();
    setupSubjectDropdown();
  }
}

function toggleDropdown(id) {
  document.querySelectorAll('.dropdown').forEach(d => {
    if (d.id === id) {
      d.classList.toggle('show');
    } else {
      d.classList.remove('show');
    }
  });
}

// 點擊外部自動收合
window.onclick = function(event) {
  if (!event.target.matches('.dropdown button')) {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('show'));
  }
}

// 動態產生科目按鈕
function setupSubjectDropdown() {
  const content = document.getElementById('subject-dropdown-content');
  content.innerHTML = '';
  subjects.filter(sub => sub.name.startsWith(grades[currentGrade]))
    .forEach((sub) => {
      if (sub.count > 0) {
        let div = document.createElement('div');
        div.innerText = `${sub.name.replace(grades[currentGrade], '')} (${sub.count})`;
        div.className = 'draggable-subject';
        //div.draggable = true; // 不用HTML5拖曳
        div.onmousedown = (e) => {
          draggingSubject = sub.name;
          draggingSubjectName = sub.name.replace(grades[currentGrade], '');
          e.preventDefault();
          window.focus();
        };
        content.appendChild(div);
      } else {
        let span = document.createElement('span');
        span.innerText = `${sub.name.replace(grades[currentGrade], '')} (0)`;
        span.className = 'draggable-subject disabled';
        content.appendChild(span);
      }
    });
}

function setupTeacherDropdown() {
  const content = document.getElementById('teacher-dropdown-content');
  content.innerHTML = '';
  teachers.forEach(name => {
    let div = document.createElement('div');
    div.innerText = name;
    div.className = 'draggable-teacher';
    //div.draggable = true; // 不用HTML5拖曳
    div.onmousedown = (e) => {
      draggingTeacher = name;
      draggingTeacherName = name;
      e.preventDefault();
    };
    content.appendChild(div);
  });
}

function onScheduleChanged() {
  // 你的課表內容有變動時呼叫這個函式
  saveToCloud();
}

// 例如在課表被編輯的地方加上 onScheduleChanged();
// 例如：拖曳完成、按下確定、或其他編輯動作後

setInterval(() => {
  if (typeof saveToCloud === "function") saveToCloud();
}, 60000); // 每60秒自動儲存一次
