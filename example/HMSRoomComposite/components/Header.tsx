import {HMSLocalPeer, HMSRoom} from '@100mslive/react-native-hms';
import React from 'react';
import {View, Text, InteractionManager} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';

import {styles} from './styles';
import {CustomButton} from './CustomButton';
import {Menu, MenuItem} from './MenuModal';
import {ModalTypes} from '../utils/types';
import {parseMetadata} from '../utils/functions';
import {RealTime} from './Modals';
import type {RootState} from '../redux';

export const Header = ({
  room,
  localPeer,
  isScreenShared,
  modalVisible,
  setModalVisible,
}: {
  room?: HMSRoom;
  localPeer?: HMSLocalPeer;
  isScreenShared?: boolean;
  modalVisible: ModalTypes;
  setModalVisible(modalType: ModalTypes, delay?: any): void;
}) => {
  // hooks
  const hmsInstance = useSelector((state: RootState) => state.user.hmsInstance);
  const roomCode = useSelector((state: RootState) => state.user.roomCode);

  // constants
  const iconSize = 20;
  const parsedMetadata = parseMetadata(localPeer?.metadata);

  // functions
  const onRaiseHandPress = async () => {
    await hmsInstance
      ?.changeMetadata(
        JSON.stringify({
          ...parsedMetadata,
          isHandRaised: !parsedMetadata?.isHandRaised,
          isBRBOn: false,
        }),
      )
      .then(d => console.log('Change Metadata Success: ', d))
      .catch(e => console.log('Change Metadata Error: ', e));
  };

  const onSwitchCameraPress = () => {
    localPeer?.localVideoTrack()?.switchCamera();
  };

  const onParticipantsPress = () => {
    InteractionManager.runAfterInteractions(() => {
      setModalVisible(ModalTypes.PARTICIPANTS);
    });
  };

  return (
    <View style={styles.iconTopWrapper}>
      <View style={styles.iconTopSubWrapper}>
        <Menu
          visible={modalVisible === ModalTypes.LEAVE_MENU}
          anchor={
            <CustomButton
              onPress={() => {
                setModalVisible(ModalTypes.LEAVE_MENU);
              }}
              viewStyle={[styles.iconContainer, styles.leaveIcon]}
              LeftIcon={
                <Feather name="log-out" style={styles.icon} size={iconSize} />
              }
            />
          }
          onRequestClose={() => setModalVisible(ModalTypes.DEFAULT)}
          style={styles.participantsMenuContainer}
        >
          <MenuItem
            onPress={() => setModalVisible(ModalTypes.LEAVE_ROOM, true)}
          >
            <View style={styles.participantMenuItem}>
              <Feather
                name="log-out"
                style={styles.participantMenuItemIcon}
                size={iconSize}
              />
              <Text style={styles.participantMenuItemName}>Leave Studio</Text>
            </View>
          </MenuItem>
          {localPeer?.role?.permissions?.endRoom && (
            <MenuItem
              onPress={() => setModalVisible(ModalTypes.END_ROOM, true)}
            >
              <View style={styles.participantMenuItem}>
                <Feather
                  name="alert-triangle"
                  style={[styles.participantMenuItemIcon, styles.error]}
                  size={iconSize}
                />
                <Text style={[styles.participantMenuItemName, styles.error]}>
                  End Session
                </Text>
              </View>
            </MenuItem>
          )}
        </Menu>
        {room?.hlsStreamingState?.running ? (
          <View>
            <View style={styles.liveTextContainer}>
              <View style={styles.liveStatus} />
              <Text style={styles.liveTimeText}>Live</Text>
            </View>
            {Array.isArray(room?.hlsStreamingState?.variants) ? (
              <RealTime
                startedAt={room?.hlsStreamingState?.variants[0]?.startedAt}
              />
            ) : null}
          </View>
        ) : (
          <Text style={styles.headerName}>{roomCode}</Text>
        )}
      </View>
      <View style={styles.iconTopSubWrapper}>
        {(room?.browserRecordingState?.running ||
          room?.hlsRecordingState?.running) && (
          <MaterialCommunityIcons
            name="record-circle-outline"
            style={styles.roomStatus}
            size={iconSize}
          />
        )}
        {(room?.hlsStreamingState?.running ||
          room?.rtmpHMSRtmpStreamingState?.running) && (
          <Ionicons
            name="globe-outline"
            style={styles.roomStatus}
            size={iconSize}
          />
        )}
        {isScreenShared && (
          <Feather name="copy" style={styles.roomStatus} size={iconSize} />
        )}
        <CustomButton
          onPress={onParticipantsPress}
          viewStyle={styles.iconContainer}
          LeftIcon={
            <Ionicons name="people" style={styles.icon} size={iconSize} />
          }
        />
        <CustomButton
          onPress={onRaiseHandPress}
          viewStyle={[
            styles.iconContainer,
            parsedMetadata?.isHandRaised && styles.iconMuted,
          ]}
          LeftIcon={
            <Ionicons
              name="hand-left-outline"
              style={[
                styles.icon,
                parsedMetadata?.isHandRaised && styles.handRaised,
              ]}
              size={iconSize}
            />
          }
        />
        <CustomButton
          onPress={() => {
            InteractionManager.runAfterInteractions(() => {
              setModalVisible(ModalTypes.CHAT);
            });
            // setNotification(false);
          }}
          viewStyle={styles.iconContainer}
          LeftIcon={
            <View>
              {/* {notification && <View style={styles.messageDot} />} */}
              <MaterialCommunityIcons
                name="message-outline"
                style={styles.icon}
                size={iconSize}
              />
            </View>
          }
        />
        {localPeer?.role?.publishSettings?.allowed?.includes('video') && (
          <CustomButton
            onPress={onSwitchCameraPress}
            viewStyle={styles.iconContainer}
            LeftIcon={
              <Ionicons
                name="camera-reverse-outline"
                style={styles.icon}
                size={iconSize}
              />
            }
          />
        )}
      </View>
    </View>
  );
};
