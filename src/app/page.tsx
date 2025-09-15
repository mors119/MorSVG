'use client';

import { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markup';

import styles from './page.module.css';

const initialSvgCode = `<svg width="100" height="100" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="deepskyblue" />
</svg>`;

export default function HomePage() {
  const [svgCode, setSvgCode] = useState<string>(initialSvgCode);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // ... (기존 useEffect 코드는 변경 없음)
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgCode, 'image/svg+xml');
    const parseError = doc.querySelector('parsererror');

    if (parseError) {
      setError('Invalid SVG code. Please check the syntax.');
    } else {
      setError('');
    }
  }, [svgCode]);

  // 1. 다운로드 핸들러 함수 추가
  const handleDownload = () => {
    // svgCode가 비어있거나 오류가 있으면 다운로드하지 않음
    if (error || !svgCode.trim()) {
      alert('Cannot download an invalid or empty SVG.');
      return;
    }

    // 1. Blob 객체 생성: SVG 코드 텍스트를 'image/svg+xml' 타입의 파일 데이터로 만듭니다.
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });

    // 2. 임시 URL 생성: 브라우저 메모리에 생성된 파일 데이터를 가리키는 고유 URL을 만듭니다.
    const url = URL.createObjectURL(blob);

    // 3. 가상의 링크(<a>) 생성 및 클릭:
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image.svg'; // 다운로드될 파일의 기본 이름을 지정합니다.
    document.body.appendChild(a); // 링크를 문서에 추가
    a.click(); // 링크를 클릭하여 다운로드 실행
    document.body.removeChild(a); // 링크 제거

    // 4. 임시 URL 해제: 메모리 누수 방지를 위해 사용이 끝난 URL을 해제합니다.
    URL.revokeObjectURL(url);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* ... (에디터 패널 부분은 변경 없음) ... */}
        <div className={`${styles.panel} ${styles.editorPanel}`}>
          <h2>SVG Code</h2>
          <div
            className={`${styles.editorContainer} ${
              error ? styles.errorBorder : ''
            }`}>
            <Editor
              value={svgCode}
              onValueChange={(code) => setSvgCode(code)}
              highlight={(code) => highlight(code, languages.markup, 'markup')}
              padding={15}
              className={styles.editor}
            />
          </div>
          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>

        <div className={styles.panel}>
          {/* 2. Preview 패널 헤더에 다운로드 버튼 추가 */}
          <div className={styles.panelHeader}>
            <h2>Preview</h2>
            <button
              onClick={handleDownload}
              className={styles.downloadButton}
              disabled={!!error}>
              Download SVG
            </button>
          </div>
          <div className={styles.previewArea}>
            {!error && <div dangerouslySetInnerHTML={{ __html: svgCode }} />}
          </div>
        </div>
      </div>
    </main>
  );
}
