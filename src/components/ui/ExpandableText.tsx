import React, { useState } from 'react';
import { Typography, Button } from '@mui/material';

interface ExpandableTextProps {
  text: string;
  maxChars?: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxChars = 200 }) => {
  const [expanded, setExpanded] = useState(false);

  const isLongText = text.length > maxChars;
  const displayedText = expanded ? text : text.slice(0, maxChars);

  return (
    <>
      <Typography variant="body1" color="text.primary" mb={1}>
        {displayedText}
        {!expanded && isLongText && '...'}
      </Typography>

      {isLongText && (
        <Button
          size="small"
          onClick={() => setExpanded(!expanded)}
          sx={{ textTransform: 'none', padding: 0 }}
        >
          {expanded ? 'Show less' : 'Read more'}
        </Button>
      )}
    </>
  );
};

export default ExpandableText;

