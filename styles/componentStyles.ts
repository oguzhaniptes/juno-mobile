import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors, createCardShadow } from "./theme";

const { width } = Dimensions.get("window");

export const createComponentStyles = (isDark: boolean) => {
  const colors = isDark ? Colors.dark : Colors.light;

  return StyleSheet.create({
    // Profile Header Styles
    profileHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: Platform.OS === "android" ? colors.cardBgSolid : colors.cardBg,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      marginBottom: 16,
      ...createCardShadow(isDark, colors, "medium"),
    },

    userInfoWrapper: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    avatar: {
      height: 48,
      width: 48,
      borderRadius: 24,
      borderWidth: 2,
      borderColor: colors.primary,
    },

    userTextContainer: {
      gap: 0,
    },

    greetingText: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: "500",
    },

    usernameText: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },

    statsRow: {
      flexDirection: "row",
      gap: 8,
    },

    statBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },

    statValue: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.text,
    },

    // Score Display Styles
    scoreCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 24,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      // ...Platform.select({
      //   ios: {
      //     shadowColor: isDark ? colors.primary : "#000",
      //     shadowOffset: { width: 0, height: 8 },
      //     shadowOpacity: isDark ? 0.5 : 0.15,
      //     shadowRadius: 20,
      //   },
      //   android: {
      //     elevation: 12,
      //   },
      // }),
    },

    scoreHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },

    scoreLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },

    matchProgress: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "600",
    },

    scoreValue: {
      fontSize: 56,
      fontWeight: "800",
      color: colors.text,
      lineHeight: 64,
    },

    pointsLabel: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "600",
    },

    badgesRow: {
      flexDirection: "row",
      gap: 8,
      marginTop: 12,
    },

    badge: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },

    // Challenge Card Styles
    challengeCard: {
      width: width * 0.7,
      height: 200,
      borderRadius: 24,
      padding: 20,
      marginRight: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
      ...Platform.select({
        ios: {
          shadowColor: isDark ? colors.primary : "#000",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: isDark ? 0.6 : 0.2,
          shadowRadius: 24,
        },
        android: {
          elevation: 16,
        },
      }),
    },

    challengeGradient: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    challengeHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },

    challengeTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: "#FFFFFF",
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },

    challengeSubtitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "rgba(255, 255, 255, 0.9)",
    },

    challengeButton: {
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.5)",
    },

    challengeFooter: {
      marginTop: "auto",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    timeLabel: {
      fontSize: 13,
      color: "rgba(255, 255, 255, 0.9)",
      fontWeight: "600",
    },

    timeValue: {
      fontSize: 14,
      color: "#FFFFFF",
      fontWeight: "700",
    },

    // Match Card Styles
    matchCard: {
      width: 240,
      // height: 120,
      backgroundColor: colors.cardBg,
      borderRadius: 20,
      padding: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      ...createCardShadow(isDark, colors, "medium"),
    },

    matchHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      // marginBottom: 16,
    },

    leagueBadge: {
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },

    leagueText: {
      fontSize: 10,
      fontWeight: "700",
      color: colors.text,
    },

    liveIndicator: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "rgba(239, 68, 68, 0.15)",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
    },

    liveDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#EF4444",
    },

    liveText: {
      fontSize: 10,
      fontWeight: "700",
      color: "#EF4444",
    },

    matchContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    teamContainer: {
      flex: 1,
      alignItems: "center",
      gap: 8,
    },

    teamLogo: {
      width: 42,
      height: 42,
      borderRadius: 21,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },

    teamName: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
    },

    vsContainer: {
      alignItems: "center",
      paddingHorizontal: 20,
    },

    scoreDisplay: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.text,
    },

    vsText: {
      fontSize: 8,
      color: colors.textSecondary,
      fontWeight: "600",
      marginTop: 4,
    },

    matchTime: {
      // marginTop: 12,
      // paddingTop: 12,
      // borderTopWidth: 1,
      borderTopColor: colors.border,
      alignItems: "center",
    },

    matchTimeText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "600",
    },

    // Create Post Styles
    createPostCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 24,
      padding: 8,
      // marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      ...createCardShadow(isDark, colors, "medium"),
      // ...Platform.select({
      //   ios: {
      //     shadowColor: isDark ? colors.primary : "#000",
      //     shadowOffset: { width: 0, height: 8 },
      //     shadowOpacity: isDark ? 0.5 : 0.15,
      //     shadowRadius: 20,
      //   },
      //   android: {
      //     elevation: 12,
      //   },
      // }),
    },

    postInput: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      fontSize: 15,
      color: colors.text,
      minHeight: 54,
      marginBottom: 12,
    },

    postActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    actionButtons: {
      flexDirection: "row",
      gap: 8,
    },

    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },

    postButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },

    postButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },

    // Section Title
    sectionTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.text,
      // marginBottom: 16,
      // marginTop: 8,
    },

    // Feed Item Styles
    feedItem: {
      backgroundColor: colors.cardBg,
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      ...createCardShadow(isDark, colors, "medium"),
    },
    // Post Card Styles
    postCard: {
      borderRadius: 20,
      paddingTop: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 20,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
      ...createCardShadow(isDark, colors, "medium"),
    },

    postAuthorSection: { marginBottom: 16 },

    postAuthorRow: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
    },

    postAuthorInfo: {
      flex: 1,
      justifyContent: "center",
    },

    postNameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    postAuthorName: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
    },

    postUsername: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },

    postTime: {
      fontSize: 13,
      color: colors.textSecondary,
    },

    postMenuButton: {
      padding: 8,
      borderRadius: 12,
      // backgroundColor: Platform.OS === "android" ? (isDark ? "#2D2440" : "#F3F4F6") : colors.surface,
    },

    postContentSection: {
      marginBottom: 16,
    },

    postContent: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.text,
    },

    postImage: {
      width: "100%",
      height: 240,
      borderRadius: 16,
      marginBottom: 16,
      backgroundColor: colors.surface,
    },

    // Post Detail Styles
    postDetailCard: {
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      ...createCardShadow(isDark, colors, "medium"),
    },

    postDetailContent: {
      fontSize: 17,
      lineHeight: 26,
      color: colors.text,
    },

    postStatsSection: {
      flexDirection: "row",
      gap: 20,
      paddingVertical: 16,
      paddingTop: 16,
      marginTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    keyboardAvoidingContainer: {
      flex: 1,
      justifyContent: "flex-end", // İçeriği (Pressable) ekranın altına it
    },

    // Modal arka planını ve klavyeden kaçınan alanı kaplar
    modalOverlayFlex: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Karartma efekti
      justifyContent: "flex-end", // İçeriği (commentModalSheet) en alta hizalar
    },

    commentModalSheet: {
      // Mevcut stilleri koru, ancak alta hizalandığından emin ol
      width: "100%",
      padding: 16,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      // Ekranın altına yapışacak
    },

    // Comment Styles
    commentInputCard: {
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      ...createCardShadow(isDark, colors, "light"),
    },

    commentInputField: {
      // minHeight: 40,
      borderRadius: 16,
      borderWidth: 1,
      padding: 12,
      fontSize: 15,
      color: colors.text,
      textAlignVertical: "top",
      marginBottom: 12,
    },

    commentSubmitButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 12,
      borderRadius: 16,
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },

    commentSubmitText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },

    commentsHeader: {
      fontSize: 20,
      fontWeight: "800",
      marginBottom: 16,
      color: colors.text,
    },

    commentCard: {
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      backgroundColor: Platform.OS === "android" ? colors.cardBgSolid : colors.cardBg,
      ...createCardShadow(isDark, colors, "light"),
    },

    // Modal Styles
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },

    modalSheet: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: 40,
      width: "100%",
    },

    modalHandle: {
      width: 40,
      height: 5,
      borderRadius: 3,
      alignSelf: "center",
      marginBottom: 20,
    },

    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 20,
    },

    modalDeleteButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FEE2E2",
      padding: 16,
      borderRadius: 16,
      marginBottom: 12,
      gap: 12,
    },

    modalDeleteText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#EF4444",
    },

    modalCancelButton: {
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
    },

    modalCancelText: {
      fontSize: 16,
      fontWeight: "600",
    },

    // commentModalSheet: {
    //   borderTopLeftRadius: 24,
    //   borderTopRightRadius: 24,
    //   padding: 24,
    //   width: "100%",
    //   maxHeight: "70%",
    // },

    commentInput: {
      minHeight: 120,
      borderRadius: 16,
      borderWidth: 1,
      padding: 16,
      fontSize: 15,
      textAlignVertical: "top",
      marginBottom: 16,
    },

    commentActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 12,
    },

    commentCancelButton: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 16,
    },

    commentCancelText: {
      fontSize: 15,
      fontWeight: "600",
    },

    commentSendButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 16,
    },

    commentSendText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "700",
    },

    userListModal: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      width: "100%",
      maxHeight: "80%",
    },
    // Profile Screen Styles
    profileCard: {
      borderRadius: 20,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      ...createCardShadow(isDark, colors, "medium"),
    },

    // Podium & Awards Styles
    podiumCard: {
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      ...createCardShadow(isDark, colors, "heavy"),
    },

    ranksCard: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      ...createCardShadow(isDark, colors, "medium"),
    },

    // Community Detail Styles
    communityDetailCard: {
      borderRadius: 20,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      ...createCardShadow(isDark, colors, "heavy"),
    },

    communityPostsCard: {
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      ...createCardShadow(isDark, colors, "medium"),
    },
  });
};
