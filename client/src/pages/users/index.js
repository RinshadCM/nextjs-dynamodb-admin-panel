// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'

const Users = () => {
  return (
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Table />
          </Grid>
        </Grid>
      </ApexChartWrapper>
  )
}

export default Users
