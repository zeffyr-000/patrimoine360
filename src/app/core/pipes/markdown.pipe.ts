import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    if (!value) return '';

    // Escape HTML entities to prevent XSS before applying markdown transforms
    let html = value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^---$/gm, '<hr>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/\|(.+)\|/g, (match, content) => {
        const cells = content.split('|').map((cell: string) => cell.trim());
        if (cells.every((cell: string) => /^-+$/.test(cell))) {
          return ''; // Skip header separator row
        }
        const cellTags = cells.map((cell: string) => `<td>${cell}</td>`).join('');
        return `<tr>${cellTags}</tr>`;
      })
      // Clean up empty lines around block elements
      .replace(/(<\/(h[1-3]|hr|ul|table|li)>)\n*/g, '$1')
      .replace(/\n*(<(h[1-3]|hr|ul|table))/g, '$1')
      // Double newlines → paragraph breaks, single newlines → spaces
      .replace(/\n\n+/g, '</p><p>')
      .replace(/\n/g, ' ');

    // Wrap in <p> if content doesn't start with a block element
    if (!html.startsWith('<')) {
      html = `<p>${html}</p>`;
    }

    // Group consecutive <li> into <ul>
    html = html.replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>');

    // Group consecutive <tr> into <table>
    html = html.replace(/(<tr>.*<\/tr>)+/g, '<table>$&</table>');

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
