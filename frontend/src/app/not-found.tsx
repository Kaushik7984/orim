"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import EmojiSadIcon from "@mui/icons-material/SentimentDissatisfied";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Container
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      maxWidth="lg"
      sx={{
        py: { xs: 8, md: 12 },
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(145deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
      }}
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Typography
          variant="h1"
          component="div"
          align="center"
          sx={{
            fontSize: { xs: "4rem", sm: "5rem", md: "6rem" },
            fontWeight: 800,
            color: "#1e40af",
            textShadow: "0px 4px 20px rgba(30, 64, 175, 0.3)",
            mb: 2,
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            4
          </motion.span>
          <motion.span
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            0
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            4
          </motion.span>
        </Typography>
      </motion.div>

      <Paper
        elevation={4}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          p: { xs: 4, md: 6 },
          borderRadius: "24px",
          maxWidth: 1000,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.7)",
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #1e40af, #3b82f6, #1e40af)",
            backgroundSize: "200% 100%",
            animation: "gradient-animation 5s ease infinite",
          },
          "@keyframes gradient-animation": {
            "0%": {
              backgroundPosition: "0% 50%",
            },
            "50%": {
              backgroundPosition: "100% 50%",
            },
            "100%": {
              backgroundPosition: "0% 50%",
            },
          },
        }}
      >
        <Box
          component={motion.div}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          sx={{
            flex: { xs: "1 1 100%", md: "0 1 40%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            py: 3,
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: { xs: 160, md: 220 },
              height: { xs: 160, md: 220 },
              borderRadius: "50%",
              backgroundColor: "rgba(30, 64, 175, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, -3, 3, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
              }}
            >
              <SearchOffIcon
                sx={{
                  width: { xs: 100, md: 140 },
                  height: { xs: 100, md: 140 },
                  color: "#1e40af",
                  opacity: 0.85,
                }}
              />
            </motion.div>
          </Box>
          <Box
            component={motion.div}
            animate={{ y: [0, -5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
            sx={{
              mt: 2,
              display: { xs: "none", md: "block" },
            }}
          >
            <EmojiSadIcon
              sx={{
                fontSize: 48,
                color: "text.secondary",
                opacity: 0.7,
              }}
            />
          </Box>
        </Box>

        <Box
          component={motion.div}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          sx={{
            flex: { xs: "1 1 100%", md: "0 1 60%" },
            textAlign: { xs: "center", md: "left" },
            py: 3,
            px: { xs: 2, md: 4 },
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.75rem" },
              background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            Page Not Found
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              fontSize: { xs: "1rem", md: "1.125rem" },
              lineHeight: 1.6,
              maxWidth: "500px",
              fontWeight: 400,
            }}
          >
            Oops! It looks like the page you&apos;re looking for doesn&apos;t
            exist or has been moved. Let&apos;s get you back on track.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <Button
              component={motion.button}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 6px 20px rgba(30, 64, 175, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => router.push("/")}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "1.05rem",
                fontWeight: 500,
                backgroundImage:
                  "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                boxShadow: "0 4px 15px rgba(30, 64, 175, 0.25)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundImage:
                    "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
                  boxShadow: "0 8px 25px rgba(30, 64, 175, 0.35)",
                },
              }}
            >
              Back to Home
            </Button>

            <Button
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "1.05rem",
                fontWeight: 500,
                borderWidth: "2px",
                borderColor: "rgba(30, 64, 175, 0.5)",
                color: "#1e40af",
                "&:hover": {
                  borderWidth: "2px",
                  borderColor: "#1e40af",
                  backgroundColor: "rgba(30, 64, 175, 0.04)",
                },
              }}
            >
              Go Back
            </Button>
          </Box>

          <Typography
            variant="body2"
            sx={{
              mt: 4,
              color: "text.secondary",
              fontSize: "0.95rem",
              opacity: 0.9,
            }}
          >
            If you believe this is an error, please{" "}
            <Link
              href="/help/contact"
              style={{
                color: "#1e40af",
                textDecoration: "none",
                fontWeight: 500,
                borderBottom: "1px dotted",
                transition: "all 0.2s ease",
              }}
            >
              contact support
            </Link>
            .
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
