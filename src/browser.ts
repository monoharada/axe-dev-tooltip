// @ts-nocheck
window.onload = () => {
  axe.configure({
    locale: AXE_LOCALE,
    rules: [
      {
        id: 'color-contrast',
        enabled: true,
      },
    ],
  });
  axe.run().then(handleAxeResults);
};

function handleAxeResults(results) {
  // console.table("axe result：", results);
  if (results.violations.length > 0) {
    // console.log("a11y issues：");
    // for (const violation of results.violations) {
    //   logViolationDetails(violation);
    // }
    createAxeCheckButton(results);
  } else {
    console.log('No accessibility issues found.');
  }
}

function logViolationDetails(violation) {
  console.log('issue:', violation.help);
  console.log('description:', violation.description);
  for (const node of violation.nodes) {
    console.log('element:', node.html);
    console.log('failureSummary:', node.failureSummary);
  }
  console.log('詳細情報:', violation.helpUrl);
  console.log('---');
}

function createAxeCheckButton(results) {
  const button = document.createElement('button');
  button.setAttribute('aria-label', 'Show accessibility problems');
  button.classList.add('axe-check-button');
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '1rem',
    right: '1rem',
    zIndex: '1000',
    padding: '0',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '50%',
    outline: 'none',
  });

  const svg = createSvgIcon();
  button.appendChild(svg);
  document.body.appendChild(button);

  let tooltipEnabled = false;
  button.addEventListener('click', () => {
    tooltipEnabled = !tooltipEnabled;
    toggleTooltip(tooltipEnabled, svg, results);
  });
}

function createSvgIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.innerHTML = `
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#777" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7 9L12 10M17 9L12 10M12 10V13M12 13L10 18M12 13L14 18" stroke="#777" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 7C11.7239 7 11.5 6.77614 11.5 6.5C11.5 6.22386 11.7239 6 12 6C12.2761 6 12.5 6.22386 12.5 6.5C12.5 6.77614 12.2761 7 12 7Z" fill="#777" stroke="#777" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `;
  Object.assign(svg.style, {
    width: '60px',
    height: '60px',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
    borderRadius: '50%',
    transition: 'stroke 0.3s ease',
  });
  svg.addEventListener('focus', () => {
    svg.style.outline = '2px solid rgba(0, 0, 0, 0.5)';
  });
  svg.addEventListener('blur', () => {
    svg.style.outline = '';
  });
  return svg;
}

function toggleTooltip(tooltipEnabled, svg, results) {
  if (tooltipEnabled) {
    for (const path of svg.querySelectorAll('path')) {
      path.setAttribute('stroke', '#39FF14');
    }
    for (const violation of results.violations) {
      for (const node of violation.nodes) {
        const element = document.querySelector(node.target[0]);
        if (element) {
          element.setAttribute('tabindex', '0'); // フォーカス可能にする
          if (!element.dataset.violationHelp) {
            element.dataset.violationHelp = JSON.stringify([]);
            element.dataset.violationDescription = JSON.stringify([]);
            element.dataset.violationFailureSummary = JSON.stringify([]);
          }
          const helpArray = JSON.parse(element.dataset.violationHelp);
          const descriptionArray = JSON.parse(element.dataset.violationDescription);
          const failureSummaryArray = JSON.parse(element.dataset.violationFailureSummary);

          helpArray.push(violation.help);
          descriptionArray.push(violation.description);
          failureSummaryArray.push(node.failureSummary);

          element.dataset.violationHelp = JSON.stringify(helpArray);
          element.dataset.violationDescription = JSON.stringify(descriptionArray);
          element.dataset.violationFailureSummary = JSON.stringify(failureSummaryArray);

          element.addEventListener('mouseover', showTooltip);
          element.addEventListener('mouseout', hideTooltip);
          element.addEventListener('focus', showTooltip); // フォーカス時にツールチップを表示
          element.addEventListener('blur', hideTooltip); // フォーカスが外れた時にツールチップを非表示
        }
      }
    }
  } else {
    for (const path of svg.querySelectorAll('path')) {
      path.setAttribute('stroke', '#777');
    }
    for (const violation of results.violations) {
      for (const node of violation.nodes) {
        const element = document.querySelector(node.target[0]);
        if (element) {
          element.removeAttribute('tabindex'); // フォーカス可能を解除
          element.removeAttribute('data-violation-help');
          element.removeAttribute('data-violation-description');
          element.removeAttribute('data-violation-failure-summary');

          element.removeEventListener('mouseover', showTooltip);
          element.removeEventListener('mouseout', hideTooltip);
          element.removeEventListener('focus', showTooltip); // フォーカス時のイベントを解除
          element.removeEventListener('blur', hideTooltip); // フォーカスが外れた時のイベントを解除
        }
      }
    }
  }
}

function showTooltip(event) {
  const a11yButton = event.target.closest('.axe-check-button');
  if (a11yButton) {
    return;
  }
  event.stopPropagation();
  const element = event.currentTarget;
  const tooltip = document.createElement('div');
  Object.assign(tooltip.style, {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(2px)',
    color: 'white',
    padding: '1rem',
    borderRadius: '5px',
    zIndex: '1000',
    width: '400px',
    wordWrap: 'break-word',
  });

  const helpArray = JSON.parse(element.dataset.violationHelp);
  const descriptionArray = JSON.parse(element.dataset.violationDescription);
  const failureSummaryArray = JSON.parse(element.dataset.violationFailureSummary);

  let tooltipText = '';
  for (let i = 0; i < helpArray.length; i++) {
    tooltipText += `Issue ${i + 1}:\nHelp: ${helpArray[i]}\nCheck: ${descriptionArray[i]}\nHow to fix it: ${failureSummaryArray[i]}\n\n`;
  }
  tooltip.innerText = tooltipText.trim();

  document.body.appendChild(tooltip);
  element.addEventListener('mousemove', (event) => {
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;

    let top = event.clientY + 10;
    let left = event.clientX + 10;

    if (top + tooltipHeight > pageHeight) {
      top = event.clientY - tooltipHeight - 10;
    }
    if (left + tooltipWidth > pageWidth) {
      left = event.clientX - tooltipWidth - 10;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  });
  element.addEventListener(
    'mouseout',
    () => {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    },
    { once: true },
  );
}

function hideTooltip(event) {
  const tooltip = document.querySelector('div[style*="position: absolute"]');
  if (tooltip?.parentNode) {
    tooltip.parentNode.removeChild(tooltip);
  }
}
