'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';

const NotFound404: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>404 - {t('notFound')}</h1>
    </div>
  );
};

export default NotFound404;
