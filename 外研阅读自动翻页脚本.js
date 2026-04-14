(function() {
  if (window.__autoTurnerV2Loaded) {
    console.log('⏺ 脚本已加载。使用 startAutoTurner() / stopAutoTurner() 控制。');
    return;
  }
  window.__autoTurnerV2Loaded = true;

  let intervalId = null;
  const INTERVAL_MS = 60000; // 1 分钟

  /**
   * 强力翻页方法：综合模拟点击 + 派发 nextPage 事件
   */
  function forceNextPage() {
    const btn = document.getElementById('btnNextPage'); // 根据您的反馈精确使用 ID
    if (!btn) {
      console.warn('⚠️ 未找到按钮 #btnNextPage，页面结构可能变化');
      return;
    }

    // 方法 1：派发网站可能监听的 nextPage 自定义事件（注意大小写）
    const customEvent = new CustomEvent('nextPage', { bubbles: true, cancelable: true });
    btn.dispatchEvent(customEvent);
    document.dispatchEvent(customEvent); // 冗余派发以防监听在 document 上

    // 方法 2：模拟完整鼠标点击序列（比 click() 更真实）
    const rect = btn.getBoundingClientRect();
    const clientX = rect.left + rect.width / 2;
    const clientY = rect.top + rect.height / 2;

    const mouseDown = new MouseEvent('mousedown', {
      view: window, bubbles: true, cancelable: true, clientX, clientY
    });
    const mouseUp = new MouseEvent('mouseup', {
      view: window, bubbles: true, cancelable: true, clientX, clientY
    });
    const clickEvent = new MouseEvent('click', {
      view: window, bubbles: true, cancelable: true, clientX, clientY
    });

    btn.dispatchEvent(mouseDown);
    btn.dispatchEvent(mouseUp);
    btn.dispatchEvent(clickEvent);

    console.log(`⏩ 已执行强力翻页 (${new Date().toLocaleTimeString()})`);
  }

  // 启动定时器
  window.startAutoTurner = function() {
    if (intervalId) {
      console.warn('⚠️ 自动翻页已在运行中');
      return;
    }
    // 可选：立即执行一次
    // forceNextPage();
    intervalId = setInterval(forceNextPage, INTERVAL_MS);
    console.log('✅ 自动翻页已启动（强力模式），每 1 分钟触发一次。使用 stopAutoTurner() 停止。');
  };

  // 停止定时器
  window.stopAutoTurner = function() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      console.log('🛑 自动翻页已停止。');
    } else {
      console.log('ℹ️ 当前没有运行中的自动翻页。');
    }
  };

  console.log('📖 自动翻页脚本 V2 已就绪。\n' +
              '   启动: startAutoTurner()\n' +
              '   停止: stopAutoTurner()\n' +
              '   （此版本使用按钮 ID + nextPage 事件双保险）');
})();