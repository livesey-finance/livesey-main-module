import { RouteBuilder } from 'livesey-routing';

export const userRouter = new RouteBuilder()
  .get('/search/:penis', (req, res) => {
    const penis = req.params.penis;
    res.json({ penis });
  })
  .post('/data', async (req, res) => {
    const body = await req.getBody();
    res.json({ received: body });
  })
  .build();
