import React from "react";
import { useRouteMatch } from "react-router-dom";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";

import ProfilePic from "../../molecules/ProfilePic";
import { SettingsItem, SettingsHeading } from "../../molecules/SettingsItem";

import Upgrade from "../../organisms/Upgrade";

import { useProfile } from "../../../hooks/useProfile";

import {
  capitalise,
  convertDate,
  formatPhoneNumber,
} from "../../../utils/formatText";
import { getMembership } from "../../../utils/profileUtils";

const Home = () => {
  const { url } = useRouteMatch();

  const { profile } = useProfile();

  const bankWithdrawal =
    process.env.REACT_APP_BANK_WITHDRAWAL?.toLowerCase() === "true";

  return (
    <Container p="12px" wide>
      <Container p="24px" flexCol="center" position="relative" wide>
        <Container w="80px" to={`${url}/profile-photo`}>
          <ProfilePic size="80px" />
        </Container>
        <Text
          p="0"
          m="12px 0 4px"
          font="12px"
          bold="true"
          flexalign="true"
          opacity="0.6"
        >
          {profile.fullName}
        </Text>
        <Text p="0" font="10px" bold="true" flexalign="true" opacity="0.4">
          {capitalise(profile.plan)}
        </Text>
      </Container>

      <Upgrade p="12px 0" m="0 0 12px 0" />

      <Container p="12px 0" wide>
        <SettingsHeading heading="Personal Information" />
        <SettingsItem
          title="Email Address"
          body={profile.email}
          to={`${url}/personal-information`}
        />
        <SettingsItem
          title="First Name"
          body={profile.firstName}
          to={`${url}/personal-information`}
        />
        <SettingsItem
          title="Last Name"
          body={profile.lastName}
          to={`${url}/personal-information`}
        />
        <SettingsItem
          title="Phone Number"
          body={formatPhoneNumber(profile.profile?.phone)}
          to={`${url}/personal-information`}
        />
        <SettingsItem
          title="Country"
          body={profile.profile?.country}
          to={`${url}/personal-information`}
        />
        {profile.profile?.country === "United States" && (
          <SettingsItem
            title="Social Security Number"
            body={profile.profile?.ssn}
            to={`${url}/personal-information`}
          />
        )}
        <SettingsItem
          title="Date of Birth"
          body={convertDate(profile.profile?.dob)}
          to={`${url}/personal-information`}
        />
        <SettingsItem
          title="Gender"
          body={capitalise(profile.profile?.gender)}
          to={`${url}/personal-information`}
        />
        <SettingsItem
          title="Date Joined"
          body={new Date(profile.createdAt).toDateString()}
          to={`${url}/personal-information`}
        />
      </Container>

      <Container p="12px 0" wide>
        <SettingsHeading heading="Account Information" />
        <SettingsItem
          title="Verification Level"
          body={capitalise(profile.plan) + " - " + getMembership(profile.plan)}
          color={profile.meta.requireUpgrade ? "orange" : undefined}
          opacity={profile.meta.requireUpgrade ? "1" : undefined}
          to={`${url}/verification`}
        />
        <SettingsItem
          title="Profile Photo"
          body="Upload profile photo"
          to={`${url}/profile-photo`}
        />
        <SettingsItem
          title="Manage Cards"
          body="Add new card or manage existing withdrawal methods"
          to={`${url}/cards`}
        />
        {bankWithdrawal && (
          <SettingsItem
            title="Manage Banks"
            body="Add new card or manage existing withdrawal methods"
            to={`${url}/banks`}
          />
        )}
        <SettingsItem
          title="Change Password"
          body="Updating your password would log you out of all devices"
          to={`${url}/change-password`}
        />
      </Container>
    </Container>
  );
};

export default Home;
