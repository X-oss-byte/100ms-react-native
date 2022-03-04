package ReactNative.pageobject;

import base.BaseTest;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;

public class LandingPage extends BaseTest {

    @iOSXCUITFindBy(accessibility = "Enter Room URL")
    @AndroidFindBy(xpath = "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.EditText")
    public WebElement meetingUrlField;

    @iOSXCUITFindBy(accessibility = "The App")
    @AndroidFindBy(xpath = "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText/android.widget.Button")
    public WebElement crossBtn;

    @iOSXCUITFindBy(accessibility = "Join Meeting")
    @AndroidFindBy(xpath = "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup")
    public WebElement joinMeetingBtn;

    public void put_meeting_url(String txt) {
        meetingUrlField.sendKeys(txt);
    }

    public void click_crossBtn() throws InterruptedException {
        crossBtn.click();
        Thread.sleep(3000);
    }

    public void click_joinMeetingBtn() throws InterruptedException {
        joinMeetingBtn.click();
        Thread.sleep(3000);
    }

}