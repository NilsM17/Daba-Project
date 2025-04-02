import React from 'react';
import { 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Paper, 
  Box,
  Typography,
  TableContainer,
  Chip
} from '@mui/material';

interface EnhancedTableProps {
  title?: string;
  headers: string[];
  children: React.ReactNode;
  actionButtons?: React.ReactNode;
}

export const EnhancedTable: React.FC<EnhancedTableProps> = ({ 
  title, 
  headers, 
  children,
  actionButtons
}) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 3, 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        mb: 4
      }}
    >
      {title && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          bgcolor: 'background.paper', 
          p: 2,
          borderBottom: '1px solid rgba(0,0,0,0.08)'
        }}>
          <Typography variant="h6" fontWeight="medium">{title}</Typography>
          {actionButtons && (
            <Box>{actionButtons}</Box>
          )}
        </Box>
      )}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={index} sx={{ fontWeight: 'bold' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {children}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};