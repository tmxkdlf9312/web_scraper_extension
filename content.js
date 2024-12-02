let scrapedData = [];

function scrapeKeywords() {
  const items = document.querySelectorAll('.rank_top1000_list li a.link_text');
  items.forEach(item => {
    const rank = item.querySelector('.rank_top1000_num').innerText.trim();
    const keyword = item.innerText.trim().replace(rank, '');
    scrapedData.push({ rank, keyword });
  });
}

async function goToNextPage() {
  const nextButton = document.querySelector('.btn_page_next');
  if (nextButton) {
    nextButton.click();
    return new Promise(resolve => setTimeout(resolve, 2000)); // 페이지 로딩 대기
  }
  return false;
}

async function startScraping() {
  for (let i = 0; i < 5; i++) { // 5페이지 크롤링
    scrapeKeywords();
    const hasNextPage = await goToNextPage();
    if (!hasNextPage) break;
  }
  return scrapedData;
}

// 메시지 수신 시 크롤링 실행
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'startScraping') {
    startScraping().then(data => {
      sendResponse({ data });
    });
  }
  return true; // 비동기 응답
});
