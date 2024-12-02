document.getElementById('startScraping').addEventListener('click', () => {
  document.getElementById('status').textContent = "크롤링 중입니다...";
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js']
    }, () => {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'startScraping' }, (response) => {
        if (response && response.data) {
          localStorage.setItem('scrapedData', JSON.stringify(response.data));
          document.getElementById('status').textContent = "크롤링 완료!";
          document.getElementById('downloadExcel').disabled = false;
        }
      });
    });
  });
});

document.getElementById('downloadExcel').addEventListener('click', () => {
  const data = JSON.parse(localStorage.getItem('scrapedData'));
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const category = "크롤링_결과"; // 카테고리 이름 (수동 설정 가능)
  const fileName = `${category}_${dateStr}.xlsx`;

  const blob = createExcelFile(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
});

function createExcelFile(data) {
  const rows = [["순번", "키워드"]];
  data.forEach(item => rows.push([item.rank, item.keyword]));

  // CSV 데이터 생성
  const csvContent = rows.map(row => row.join(",")).join("\n");

  // UTF-8 BOM 추가
  const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
  return blob;
}

document.getElementById('downloadExcel').addEventListener('click', () => {
  const data = JSON.parse(localStorage.getItem('scrapedData'));
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const category = "크롤링_결과"; // 카테고리 이름
  const fileName = `${category}_${dateStr}.csv`; // 확장자를 .csv로 변경

  const blob = createExcelFile(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
});

