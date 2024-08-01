import { Card, CardContent, Typography } from "@mui/material";

const NoDataCard = () => (
    <Card sx={{ minWidth: 275, textAlign: 'center', my: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div" color="text.secondary">
          No Data Available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          There are currently no records to display.
        </Typography>
      </CardContent>
    </Card>
  );

export default NoDataCard