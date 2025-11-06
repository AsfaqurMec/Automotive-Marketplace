import { useEffect } from 'react';
import { getWindow } from '@/lib/utils/inBrowser';

interface FormikValues {
  [key: string]: {
    image?: File | null;
    imgUrl?: string;
    [key: string]: unknown;
  };
}

interface FormikForm {
  values: FormikValues;
  initialValues: FormikValues;
  setFieldValue: (field: string, value: unknown) => void;
}

// Custom hook for preview effect - must be outside component
export const usePreviewEffect = (formik: FormikForm, adCreativeKey: string) => {
  const imageFileFromFormik = formik.values[adCreativeKey]?.image;
  const initialImgUrlForCreative = formik.initialValues[adCreativeKey]?.imgUrl;
  const { setFieldValue, values: currentFormikValues } = formik;

  useEffect(() => {
    let newObjectUrlCreatedInThisEffect: string | null = null;

    const currentImgUrlValue = currentFormikValues[adCreativeKey]?.imgUrl;

    if (getWindow() && imageFileFromFormik instanceof File && imageFileFromFormik.name) {
      newObjectUrlCreatedInThisEffect = URL.createObjectURL(imageFileFromFormik);
      if (currentImgUrlValue !== newObjectUrlCreatedInThisEffect) {
        setFieldValue(`${adCreativeKey}.imgUrl`, newObjectUrlCreatedInThisEffect);
      }
    } else if (imageFileFromFormik === null) {
      const targetResetUrl = initialImgUrlForCreative || '';
      if (currentImgUrlValue !== targetResetUrl) {
        setFieldValue(`${adCreativeKey}.imgUrl`, targetResetUrl);
      }
    }

    return () => {
      if (newObjectUrlCreatedInThisEffect) {
        URL.revokeObjectURL(newObjectUrlCreatedInThisEffect);
      }
    };
  }, [imageFileFromFormik, adCreativeKey, initialImgUrlForCreative, setFieldValue, currentFormikValues]);
};
