import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
} from 'react-native-reanimated';

import {COLORS} from '../utils/theme';
import {HMSManageLeave} from './HMSManageLeave';
import {HMSManageCameraRotation} from './HMSManageCameraRotation';

interface HeaderProps {
  offset: SharedValue<number>;
}

export const _Header: React.FC<HeaderProps> = ({offset}) => {
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: offset.value,
      // transform: [{ translateY: interpolate(offset.value, [0, 1], [-10, 0]) }]
    };
  }, []);

  const animatedProps = useAnimatedProps((): {
    pointerEvents: 'none' | 'auto';
  } => {
    return {
      pointerEvents: offset.value === 0 ? 'none' : 'auto',
    };
  }, []);

  return (
    <Animated.View style={animatedStyles} animatedProps={animatedProps}>
      <View style={styles.container}>
        <HMSManageLeave />
        <HMSManageCameraRotation />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.BACKGROUND.DIM,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export const Header = memo(_Header);

// export const _Header2 = ({
//   isLeaveMenuOpen,
//   setModalVisible,
// }: {
//   isLeaveMenuOpen: boolean;
//   setModalVisible(modalType: ModalTypes, delay?: any): void;
// }) => {
//   // hooks
//   const hmsInstance = useSelector((state: RootState) => state.user.hmsInstance);
//   const room = useSelector((state: RootState) => state.hmsStates.room);
//   const localPeer = useSelector(
//     (state: RootState) => state.hmsStates.localPeer,
//   );
//   const roomCode = useSelector((state: RootState) => state.user.roomCode);
//   const isScreenShared = useSelector(
//     (state: RootState) => state.hmsStates.isLocalScreenShared,
//   );
//   const showLandscapeLayout = useShowLandscapeLayout();

//   // constants
//   const iconSize = 20;

//   // functions

//   return (
//     <View
//       style={[
//         styles.iconTopWrapper,
//         showLandscapeLayout ? styles.iconTopWrapperLandscape : null,
//       ]}
//     >
//       <View
//         style={[
//           styles.iconTopSubWrapper,
//           showLandscapeLayout ? styles.iconTopSubWrapperLandscape : null,
//         ]}
//       >
//         {room?.hlsStreamingState?.running ? (
//           <View>
//             <View style={styles.liveTextContainer}>
//               <View style={styles.liveStatus} />
//               <Text style={styles.liveTimeText}>Live</Text>
//             </View>
//             {Array.isArray(room?.hlsStreamingState?.variants) ? (
//               <RealTime
//                 startedAt={room?.hlsStreamingState?.variants[0]?.startedAt}
//               />
//             ) : null}
//           </View>
//         ) : (
//           <Text style={styles.headerName}>{roomCode}</Text>
//         )}
//       </View>
//       <View
//         style={[
//           styles.iconTopSubWrapper,
//           showLandscapeLayout ? styles.iconTopSubWrapperLandscape : null,
//         ]}
//       >
//         {(room?.browserRecordingState?.running ||
//           room?.hlsRecordingState?.running) && (
//           <MaterialCommunityIcons
//             name="record-circle-outline"
//             style={
//               showLandscapeLayout
//                 ? styles.roomStatusLandscape
//                 : styles.roomStatus
//             }
//             size={iconSize}
//           />
//         )}
//         {(room?.hlsStreamingState?.running ||
//           room?.rtmpHMSRtmpStreamingState?.running) && (
//           <Ionicons
//             name="globe-outline"
//             style={
//               showLandscapeLayout
//                 ? styles.roomStatusLandscape
//                 : styles.roomStatus
//             }
//             size={iconSize}
//           />
//         )}
//         {isScreenShared && (
//           <Feather
//             name="copy"
//             style={
//               showLandscapeLayout
//                 ? styles.roomStatusLandscape
//                 : styles.roomStatus
//             }
//             size={iconSize}
//           />
//         )}
//       </View>
//     </View>
//   );
// };