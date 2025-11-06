import React from 'react';
import { Box, Tab, Tabs, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const theme = useTheme<Theme>();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        // ✅ Removed Typography wrapper to prevent <p> nesting inside <h6>
        <Box sx={{ p: isLargeScreen ? 3 : 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface NextDealTabProps {
  tabs: string[];
  contents: React.ReactNode[];
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
  value: number;
}

function NextDealTab({ tabs, contents, handleChange, value }: NextDealTabProps) {
  const theme = useTheme<Theme>();

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            '& .MuiTab-root': {
              color: theme.palette.action.active,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab}
              {...a11yProps(index)}
              sx={{
                color:
                  value === index
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {contents.map((content, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          {content}
        </CustomTabPanel>
      ))}
    </Box>
  );
}

export default NextDealTab;
