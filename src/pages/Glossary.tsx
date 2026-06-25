import { useMemo, useState } from 'react';
import { useTranslation } from '../i18n/useTranslation';
import { searchTerms, getTermCount } from '../utils/terms';

export default function Glossary() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchTerms(query), [query]);
  const total = getTermCount();

  return (
    <div className="page page-glossary">
      <h1 className="page-title">{t('glossary.title')}</h1>
      <p className="glossary-subtitle">
        {t('glossary.count', { n: total })}
      </p>

      <div className="glossary-search">
        <input
          type="search"
          className="glossary-search-input"
          placeholder={t('glossary.search.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
      </div>

      {results.length === 0 ? (
        <p className="glossary-empty">{t('glossary.noResults')}</p>
      ) : (
        <ul className="glossary-list">
          {results.map((term) => (
            <li key={term.key} className="glossary-item">
              <div className="glossary-item-head">
                <span className="glossary-term-ja">{term.ja}</span>
                <span className="glossary-term-zh">{term.zh}</span>
              </div>
              <p className="glossary-term-desc">{term.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
