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
  } else {
    return false; // 다음 버튼이 없으면 종료
  }
}

async function startScraping() {
  for (let i = 0; i < 5; i++) { // 최대 5페이지
    scrapeKeywords();
    const hasNextPage = await goToNextPage();
    if (!hasNextPage) {
      console.log('더 이상 페이지가 없습니다.');
      break;
    }
  }

  // 크롤링 데이터 출력
  console.log(scrapedData);

  // 크롤링 결과를 확장 프로그램으로 전송
  chrome.runtime.sendMessage({ type: 'scrapedData', data: scrapedData });
}

// 크롤링 작업 시작
startScraping();
