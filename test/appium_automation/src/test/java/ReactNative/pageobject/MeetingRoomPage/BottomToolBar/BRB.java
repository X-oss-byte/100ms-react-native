package ReactNative.pageobject.MeetingRoomPage.BottomToolBar;

import base.BaseTest;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import org.openqa.selenium.WebElement;
import org.testng.Assert;

public class BRB extends BaseTest {

    @iOSXCUITFindBy(accessibility = "sendMessage")
    @AndroidFindBy(accessibility = "sendMessage")
    public WebElement chatBtn;

    @iOSXCUITFindBy(accessibility = "Everyone")
    @AndroidFindBy(accessibility = "Everyone")
    public WebElement chatRoleBtn;

    @iOSXCUITFindBy(accessibility = "Everyone")
    @AndroidFindBy(xpath = "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.widget.EditText")
    public WebElement chatEnterMsgBtn;

    @iOSXCUITFindBy(accessibility = "Everyone")
    @AndroidFindBy(xpath = "/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View[1]/android.view.View/android.view.View[3]")
    public WebElement chatSendBtn;

    //need a unique xpath
    @iOSXCUITFindBy(accessibility = "Everyone")
    @AndroidFindBy(accessibility = "Everyone")
    public WebElement chatCrossBtn;

    public void click_chatBtn() throws InterruptedException {
        Assert.assertTrue(chatBtn.isDisplayed());
        chatBtn.click();
        Thread.sleep(3000);
    }
}