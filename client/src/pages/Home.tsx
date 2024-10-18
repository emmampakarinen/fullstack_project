import { ReactElement } from 'react'
import { Box, Typography } from '@mui/material'


const Home = (): ReactElement => {

  return (
      <Box display="flex" flexDirection="column" alignItems="center">
          <Typography p={3} variant='h3'>Hello this is home</Typography>
          <Typography p={3} variant='overline'>should only be accessible when logged in</Typography>
      </Box>
  )
}

export default Home