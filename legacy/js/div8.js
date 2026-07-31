function toggleFaq(element) {
  const item = element.parentElement;
  
  // Close all other items
  const allItems = document.querySelectorAll('.d8-faq-item');
  allItems.forEach(faq => {
    if (faq !== item) {
      faq.classList.remove('active');
    }
  });
  
  // Toggle current item
  item.classList.toggle('active');
}
