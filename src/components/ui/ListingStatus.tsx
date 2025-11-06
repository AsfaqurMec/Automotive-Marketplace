import React from 'react';
import {
  FaClipboardCheck,
  FaPlusCircle,
  FaTrash,
  FaBell,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import '../style/listingStatus.css';
import { useTranslation } from 'react-i18next';

interface ListingItem {
  createdAt: string;
  status: string;
}

const ListingStatus: React.FC<{ data: ListingItem[], deleteCount: number }> = ({ data, deleteCount }) => {
  const { t } = useTranslation();
  const today = new Date();

  // new

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const recentItems = data?.filter((item) => {
    const createdAt = new Date(item.createdAt);
    return createdAt >= sevenDaysAgo && createdAt <= today;
  });

  // near by expiry

  const upperBound = new Date();
  upperBound.setDate(today.getDate() - 29);

  const lowerBound = new Date();
  lowerBound.setDate(today.getDate() - 26);

  const nearExpiryItems = data?.filter((item) => {
    const createdAt = new Date(item.createdAt);
    return createdAt >= upperBound && createdAt <= lowerBound;
  });

  // expiry

  const expiary = new Date();
  expiary.setDate(today.getDate() - 30);

  const expiaryItems = data?.filter((item) => {
    const createdAt = new Date(item.createdAt);
    return createdAt <= expiary;
  });

  // active
  const activeItems = data?.filter((item) => item.status === 'Available');

  return (
    <div className="listing-status-wrapper">
      <div className="listing-status-container">
        <div className="listing-status-card">
          <div className="card-icon blue">
            <FaClipboardCheck />
          </div>
          <div className="card-content">
            <p className="card-label">{t('all')}</p>
            <p className="card-subtext">
              {data?.length || 0} {t('listings')}
            </p>
            <p className="card-price blue">₪ {data?.length || 0}</p>
          </div>
        </div>

        <div className="listing-status-card">
          <div className="card-icon blue">
            <FaPlusCircle />
          </div>
          <div className="card-content">
            <p className="card-label">{t('new')}</p>
            <p className="card-subtext">
              {recentItems?.length || 0} {t('listings')}
            </p>
            <p className="card-price blue">₪{recentItems?.length || 0}</p>
          </div>
        </div>

        <div className="listing-status-card">
          <div className="card-icon yellow">
            <FaClock />
          </div>
          <div className="card-content">
            <p className="card-label">{t('active')}</p>
            <p className="card-subtext">
              {activeItems?.length || 0} {t('listings')}
            </p>
            <p className="card-price yellow">₪ {activeItems?.length || 0}</p>
          </div>
        </div>

        <div className="listing-status-card">
          <div className="card-icon yellow">
            <FaBell />
          </div>
          <div className="card-content">
            <p className="card-label">{t('nearEndOfExclusivity')}</p>
            <p className="card-subtext">
              {nearExpiryItems?.length || 0} {t('listings')}
            </p>
            <p className="card-price yellow">₪ {nearExpiryItems?.length || 0}</p>
          </div>
        </div>

        <div className="listing-status-card">
          <div className="card-icon red">
            <FaExclamationTriangle />
          </div>
          <div className="card-content">
            <p className="card-label">{t('exclusivityEnded')}</p>
            <p className="card-subtext">
              {expiaryItems?.length || 0} {t('listings')}
            </p>
            <p className="card-price red">₪ {expiaryItems?.length || 0}</p>
          </div>
        </div>

        <div className="listing-status-card">
          <div className="card-icon red">
            <FaTrash />
          </div>
          <div className="card-content">
            <p className="card-label">{t('removed')}</p>
            <p className="card-subtext">
              {deleteCount || 0} {t('listings')}
            </p>
            <p className="card-price red">₪ {deleteCount || 0}</p>
          </div>
        </div>

        <div className="listing-status-card">
          <div className="card-icon green">
            <FaCheckCircle />
          </div>
          <div className="card-content">
            <p className="card-label">{t('soldAllFees')}</p>
            <p className="card-subtext">0 {t('listings')}</p>
            <p className="card-price green">₪0</p>
          </div>
        </div>

        <div className="listing-status-card">
          <div className="card-icon green">
            <FaCheckCircle />
          </div>
          <div className="card-content">
            <p className="card-label">{t('soldSellerFee')}</p>
            <p className="card-subtext">0 {t('listings')}</p>
            <p className="card-price green">₪0</p>
          </div>
        </div>

        <div className="listing-status-card">
          <div className="card-icon green">
            <FaCheckCircle />
          </div>
          <div className="card-content">
            <p className="card-label">{t('soldBuyerFee')}</p>
            <p className="card-subtext">0 {t('listings')}</p>
            <p className="card-price green">₪0</p>
          </div>
        </div>

        <div className="listing-status-card">
          <div className="card-icon orange">
            <FaCheckCircle />
          </div>
          <div className="card-content">
            <p className="card-label">{t('soldExternalBuyerFee')}</p>
            <p className="card-subtext">0 {t('listings')}</p>
            <p className="card-price orange">₪0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingStatus;

