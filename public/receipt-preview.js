function isReceipt(receipt) {
  return receipt &&
    (typeof receipt.date === "string" || receipt.date instanceof Date) &&
    Number.isFinite(new Date(receipt.date).getTime()) &&
    Number.isFinite(receipt.invoiceNumber) &&
    typeof receipt.totalAmount === "string" &&
    typeof receipt.totalDiscount === "string" &&
    typeof receipt.netTotal === "string" &&
    Array.isArray(receipt.items) && receipt.items.every(item =>
      item && typeof item.productName === "string" &&
      [item.quantity, item.price, item.totalAmount].every(value =>
        typeof value === "string" || Number.isFinite(value)
      )
    );
}

export function receiveReceipt(renderReceipt) {
  const opener = window.opener;
  const origin = window.location.origin;
  const showUnavailable = () => {
    document.body.textContent = "Receipt unavailable. Return to the receipt form and click Print again.";
  };

  if (!opener || opener.closed) {
    showUnavailable();
    return;
  }

  const listener = new AbortController();
  const timeout = window.setTimeout(() => {
    listener.abort();
    showUnavailable();
  }, 10_000);

  window.addEventListener("message", event => {
    if (event.origin !== origin || event.source !== opener) {
      return;
    }

    const data = event.data;
    if (data?.type !== "receipt-data" || !Number.isFinite(data.discountRate) || !isReceipt(data.receipt)) {
      return;
    }

    window.clearTimeout(timeout);
    listener.abort();
    renderReceipt(data.receipt, data.discountRate);
  }, { signal: listener.signal });

  opener.postMessage("receipt-ready", origin);
}
