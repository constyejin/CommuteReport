// 페이지 로드 시 로컬 스토리지 값 로드
window.onload = function() {
  var name = localStorage.getItem("commuteName");
  var startTime = localStorage.getItem("commuteStartTime");
  var endTime = localStorage.getItem("commuteEndTime");
  
  document.getElementById("name").value = name;
  document.getElementById("startTime").value = startTime;
  document.getElementById("endTime").value = endTime;

  // 현재 날짜 확인 후 주말 출근 체크박스 비활성화
  var today = new Date();
  var isSunday = today.getDay() === 0;
  var isMonday = today.getDay() === 1;
  var weekendCheck = document.getElementById("weekendCheck");
  var saturdayCheckbox = document.getElementById("chk_saturday");
  var sundayCheckbox = document.getElementById("chk_sunday");

  if (!isMonday && !isSunday) {
    weekendCheck.classList.add('disabled')
    saturdayCheckbox.disabled = true;
    sundayCheckbox.disabled = true;
  } else {
    saturdayCheckbox.disabled = false;
    sundayCheckbox.disabled = false;
  }
}

//토스트 
// const toastTrigger = document.getElementById('copyButton');
// const toastLiveExample = document.getElementById('clipboardToast');
// const validationMsg = document.getElementById('validationToast');
// const validationToast = bootstrap.Toast.getOrCreateInstance(validationMsg);

// if (toastTrigger) {
//   const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
//   toastTrigger.addEventListener('click', () => {
//     toastBootstrap.show()
//   })
// }

// 현재 시간 채우기
function fillCurrentTime(id) {
  var now = new Date();
  var hours = padZero(now.getHours());
  var minutes = padZero(now.getMinutes());
  document.getElementById(id).value = hours + ':' + minutes;
  
  if (id == "startTime") {
    generateArrivalReport();
  } else {
    generateDepartureReport();
  }
  copyToClipboard();
}

function generateArrivalReport() {
  var startDate = new Date();
  var endDate = new Date();
  var startTime = document.getElementById("startTime").value;
  var endTime = document.getElementById("endTime").value;
  var name = document.getElementById("name").value;

  var saturdayCheckbox = document.getElementById("chk_saturday").checked;
  var sundayCheckbox = document.getElementById("chk_sunday").checked;

  //유효성 체크
  if (!name || !startTime || !endTime) {
    validationToast.show();
    return;
  }

  // 월요일에만 주말 출근 체크박스를 적용
  if (startDate.getDay() === 1) { // 월요일
    if (sundayCheckbox) {
      endDate.setDate(startDate.getDate() - 1); // 일요일 출근 -> 토요일 퇴근
    } else if (saturdayCheckbox) {
      endDate.setDate(startDate.getDate() - 2); // 토요일 출근 -> 금요일 퇴근
    } else {
      endDate.setDate(startDate.getDate() - 3); // 일반적인 경우 금요일 퇴근
    }
  } else {
    endDate.setDate(startDate.getDate() - 1); // 일반적인 경우
    if (endDate.getDay() === 6) { // 토요일
      endDate.setDate(endDate.getDate() - 1); // 금요일로 변경
    } else if (endDate.getDay() === 0) { // 일요일
      endDate.setDate(endDate.getDate() - 2); // 금요일로 변경
    }
  }

  var reportText = name + " 출근 보고드립니다.<br>";
  reportText += "-퇴근 " + getFormattedDateTime(endDate, endTime) + "<br>";
  reportText += "-출근 " + getFormattedDateTime(startDate, startTime);

  document.getElementById("report").innerHTML = reportText;

  // 출퇴근 시간 로컬스토리지에 저장
  localStorage.setItem("commuteName", name);
  localStorage.setItem("commuteStartTime", startTime);
  localStorage.setItem("commuteEndTime", endTime);

  // 복사 버튼 활성화
  document.getElementById("copyButton").style.display = "block";
}

function generateDepartureReport() {
  var startDate = new Date();
  var endDate = new Date();
  var startTime = document.getElementById("startTime").value;
  var endTime = document.getElementById("endTime").value;
  var name = document.getElementById("name").value;

  //유효성 체크
  if (!name || !startTime || !endTime) {
    validationToast.show();
    return;
  }

  var reportText = name + " 퇴근 보고드립니다.<br>";
  reportText += "-출근 " + getFormattedDateTime(startDate, startTime) + "<br>";
  reportText += "-퇴근 " + getFormattedDateTime(endDate, endTime);

  document.getElementById("report").innerHTML = reportText;

  // 출퇴근 시간 로컬스토리지에 저장
  localStorage.setItem("commuteName", name);
  localStorage.setItem("commuteStartTime", startTime);
  localStorage.setItem("commuteEndTime", endTime);

  // 복사 버튼 활성화
  document.getElementById("copyButton").style.display = "block";
}

// 날짜 및 시간 형식 지정 함수
function getFormattedDateTime(date, time) {
  var month = padZero(date.getMonth() + 1);
  var day = padZero(date.getDate());
  var weekday = getWeekday(date.getDay());
  var hours = time.split(':')[0];
  var minutes = time.split(':')[1];

  return month + "월 " + day + "일(" + weekday + ") " + hours + "시 " + minutes + "분";
}

// 숫자 포맷팅 함수
function padZero(num) {
  return num < 10 ? '0' + num : num;
}

// 요일 반환 함수
function getWeekday(day) {
  var weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return weekdays[day];
}


//유효성 검사
function validationCheck() {
  if (startTime == undefined || startTime == null) {
    validationToast.show();
    alert('에러');
    return;
  }
}

// 복사 버튼 클릭 시 텍스트를 클립보드에 복사
async function copyToClipboard() {
  try {
    var reportText = document.getElementById("report").innerText;
    await navigator.clipboard.writeText(reportText);
    console.log("출/퇴근보고가 클립보드에 복사되었습니다.");
  } catch (err) {
    console.error("클립보드에 복사하는 중 오류가 발생했습니다.", err);
  }
}

