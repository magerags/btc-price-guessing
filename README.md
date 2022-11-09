This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

The app is deployed at btcguesser.tomwhittl.com

or you can run it locally as detailed below:

First run npm install within the code directory

```bash
npm i
```

then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Using the app

The interface should be relatively intuitive, you press the up button to guess that the price will increase and vice versa. The countdown in the middle will begin and during that time the buttons will be inactive and the price won't refresh. When the countdown hits zero it then change to a tick, cross or timer.

- ✅ is a correct guess and +1 score.
- ❌ is an incorrect guess and -1 score.
- ⏳ means the the price hasn't changed within the 60 seconds. It will automatically change to a ✅ or ❌ when the price does change. This shouldn't take more than 2 minutes.

## Notes

- All relevant code is located within pages/index.js and the 'hooks' folder
- I have used [styled components](https://styled-components.com/) to style the app apart from a few existing styles from the create-next-app bootstrap
- The app will remember your score based on local storage. e.g same browser and device. THIS ONLY WORKS ON PRODUCTION.
- A sound will play depending on whether the guess was correct or not

## Time Limitations

With more time I would have implemented the following:

- Unit tests using Jest
- Moved the game section into it's own component
- Shown a history of guesses

## Backend Data Store

I have not used a backend data store as it was not neccessary for the functioning of the app and I ran out of time. If I were to use a backend store I would store a json in AWS S3 for an app this simple. In the email sent with this challenge I have included screenshots of how I have done this before. In more complicated apps I would use MongoDB, AWS RDS or another database depending on the use case.
